/* eslint-disable no-unused-vars */
import {
  put, call, select, takeLatest, take,
} from 'redux-saga/effects';

import {
  RESOLVE_LOG_ENTRY,
  TRIGGER_LOG_ENTRY,
  ANNOTATE_LOG_ENTRY,
  LINK_LOG_ENTRY,
  UNLINK_LOG_ENTRY,
} from 'util/log-entries';
import {
  pd,
} from 'util/pd-api-wrapper';

import {
  UPDATE_CONNECTION_STATUS_REQUESTED,
} from 'redux/connection/actions';
import {
  UPDATE_INCIDENTS_LIST,
} from 'redux/incidents/actions';

import selectIncidents from 'redux/incidents/selectors';

import {
  FETCH_LOG_ENTRIES_REQUESTED,
  FETCH_LOG_ENTRIES_COMPLETED,
  FETCH_LOG_ENTRIES_ERROR,
  UPDATE_RECENT_LOG_ENTRIES,
  UPDATE_RECENT_LOG_ENTRIES_COMPLETED,
  UPDATE_RECENT_LOG_ENTRIES_ERROR,
  CLEAN_RECENT_LOG_ENTRIES,
  CLEAN_RECENT_LOG_ENTRIES_COMPLETED,
  CLEAN_RECENT_LOG_ENTRIES_ERROR,
} from './actions';

import selectLogEntries from './selectors';

export function* getLogEntriesAsync() {
  yield takeLatest(FETCH_LOG_ENTRIES_REQUESTED, getLogEntries);
}

export function* getLogEntries(action) {
  try {
    //  Create params and call pd lib
    const {
      since,
    } = action;
    const params = {
      since: since.toISOString().replace(/\.[\d]{3}/, ''),
      'include[]': ['incidents'],
    };
    const response = yield call(pd.all, 'log_entries', {
      data: { ...params },
      headers: {
        'X-EARLY-ACCESS': 'flex-service-early-access',
      },
    });
    if (response.status !== 200) {
      throw Error('Unable to fetch log entries');
    }
    const logEntries = response.resource;
    yield put({ type: FETCH_LOG_ENTRIES_COMPLETED, logEntries });

    // Call to update recent log entries with this data.
    yield call(updateRecentLogEntries);
  } catch (e) {
    // Handle API auth failure
    if (e.status === 401) {
      e.message = 'Unauthorized Access';
    }
    yield put({ type: FETCH_LOG_ENTRIES_ERROR, message: e.message });
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: e.message,
    });
  }
}

export function* updateRecentLogEntriesAsync() {
  yield takeLatest(UPDATE_RECENT_LOG_ENTRIES, updateRecentLogEntries);
}

export function* updateRecentLogEntries() {
  try {
    // Grab log entries & alerts from store and determine what is recent based on last polling
    take(FETCH_LOG_ENTRIES_COMPLETED);
    const {
      logEntries, recentLogEntries,
    } = yield select(selectLogEntries);
    const recentLogEntriesLocal = [...recentLogEntries];
    const addSet = new Set();
    const removeSet = new Set();
    const updateSet = new Set();
    const linkLogEntryList = [];

    // Get existing incidents in store for patching alerts
    const {
      incidents,
    } = yield select(selectIncidents);

    // yield doesn't work with forEach; using old implementation
    for (let i = 0; i < logEntries.length; i++) {
      // Skip duplicate log entry
      const logEntry = logEntries[i];
      if (recentLogEntriesLocal.filter((x) => x.id === logEntry.id).length > 0) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Push new log entry to array with details
      const logEntryDate = new Date(logEntry.created_at);
      recentLogEntriesLocal.push({
        date: logEntryDate,
        id: logEntry.id,
      });

      // Find out what incidents need to be updated based on log entry type
      if (logEntry.type === RESOLVE_LOG_ENTRY || logEntry.type === UNLINK_LOG_ENTRY) {
        // We no longer need to remove the incident as filters later on take care of this
        updateSet.add(logEntry);
      } else if (logEntry.type === TRIGGER_LOG_ENTRY) {
        addSet.add(logEntry);
      } else if (logEntry.type === ANNOTATE_LOG_ENTRY) {
        // Handle special case for notes: create synthetic notes object
        const modifiedLogEntry = { ...logEntry };
        const tempIncident = { ...modifiedLogEntry.incident };
        tempIncident.notes = [
          {
            id: null, // This is missing in log_entries
            user: logEntry.agent,
            channel: {
              summary: 'The PagerDuty website or APIs',
            },
            content: logEntry.channel.summary,
            created_at: logEntry.created_at,
          },
        ];
        modifiedLogEntry.incident = tempIncident;
        updateSet.add(modifiedLogEntry);
      } else if (logEntry.type === LINK_LOG_ENTRY) {
        // Handle special case for alerts: create synthetic alerts object
        // TODO: Consider moving this logic to updateIncidentsList saga
        linkLogEntryList.push(logEntry);
      } else {
        // Assume everything else is an update
        updateSet.add(logEntry);
      }
    }

    // Deduplicate link log entries on incident id, then fetch alerts and patch incident object
    linkLogEntryList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Force reverse sort for find below
    const incidentIds = [...new Set(linkLogEntryList.map((logEntry) => logEntry.incident.id))];
    for (let i = 0; i < incidentIds.length; i++) {
      const incidentId = incidentIds[i];
      const modifiedLogEntry = {
        ...linkLogEntryList.find((logEntry) => logEntry.incident.id === incidentId),
      };
      const tempIncident = { ...modifiedLogEntry.incident };
      // FIXME: Pagination fails beyond the max limit below - need to replace PDJS lib.
      const alertsResponse = yield call(pd.all, `incidents/${incidentId}/alerts`, {
        data: { limit: 100 },
      });
      const fetchedAlerts = [];
      alertsResponse.data.forEach((data) => {
        fetchedAlerts.push(...data.alerts);
      });
      tempIncident.alerts = fetchedAlerts;
      modifiedLogEntry.incident = tempIncident;
      updateSet.add(modifiedLogEntry);
    }

    // Generate update lists from sets
    const addList = [...addSet].filter((x) => !removeSet.has(x));
    const updateList = [...updateSet].filter((x) => !removeSet.has(x) && !addSet.has(x));
    const removeList = [...removeSet];

    // Update recent log entries and dispatch update incident list
    yield put({
      type: UPDATE_RECENT_LOG_ENTRIES_COMPLETED,
      recentLogEntries: recentLogEntriesLocal,
    });
    yield put({
      type: UPDATE_INCIDENTS_LIST,
      addList,
      updateList,
      removeList,
    });
  } catch (e) {
    yield put({ type: UPDATE_RECENT_LOG_ENTRIES_ERROR, message: e.message });
  }
}

export function* cleanRecentLogEntriesAsync() {
  yield takeLatest(CLEAN_RECENT_LOG_ENTRIES, cleanRecentLogEntries);
}

export function* cleanRecentLogEntries() {
  try {
    yield put({
      type: CLEAN_RECENT_LOG_ENTRIES_COMPLETED,
      recentLogEntries: [],
    });
  } catch (e) {
    yield put({ type: CLEAN_RECENT_LOG_ENTRIES_ERROR, message: e.message });
  }
}
