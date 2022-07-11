/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest, takeEvery, all, take,
} from 'redux-saga/effects';

import Fuse from 'fuse.js';

import {
  pd, throttledPdAxiosRequest, pdParallelFetch,
} from 'util/pd-api-wrapper';

import {
  filterIncidentsByField, filterIncidentsByFieldOfList,
} from 'util/incidents';
import {
  pushToArray,
} from 'util/helpers';
import fuseOptions from 'config/fuse-config';
import {
  MAX_INCIDENTS_LIMIT,
} from 'config/constants';

import selectQuerySettings from 'redux/query_settings/selectors';
import selectIncidentTable from 'redux/incident_table/selectors';
import selectLogEntries from 'redux/log_entries/selectors';
import {
  UPDATE_CONNECTION_STATUS_REQUESTED,
} from 'redux/connection/actions';

import {
  FETCH_INCIDENTS_REQUESTED,
  FETCH_INCIDENTS_COMPLETED,
  FETCH_INCIDENTS_ERROR,
  FETCH_INCIDENT_NOTES_REQUESTED,
  FETCH_INCIDENT_NOTES_COMPLETED,
  FETCH_INCIDENT_NOTES_ERROR,
  FETCH_ALL_INCIDENT_NOTES_REQUESTED,
  FETCH_ALL_INCIDENT_NOTES_COMPLETED,
  FETCH_ALL_INCIDENT_NOTES_ERROR,
  FETCH_ALL_INCIDENT_ALERTS_REQUESTED,
  FETCH_ALL_INCIDENT_ALERTS_COMPLETED,
  FETCH_ALL_INCIDENT_ALERTS_ERROR,
  UPDATE_INCIDENTS_LIST,
  UPDATE_INCIDENTS_LIST_COMPLETED,
  UPDATE_INCIDENTS_LIST_ERROR,
  FILTER_INCIDENTS_LIST_BY_PRIORITY,
  FILTER_INCIDENTS_LIST_BY_PRIORITY_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_PRIORITY_ERROR,
  FILTER_INCIDENTS_LIST_BY_STATUS,
  FILTER_INCIDENTS_LIST_BY_STATUS_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_STATUS_ERROR,
  FILTER_INCIDENTS_LIST_BY_URGENCY,
  FILTER_INCIDENTS_LIST_BY_URGENCY_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_URGENCY_ERROR,
  FILTER_INCIDENTS_LIST_BY_TEAM,
  FILTER_INCIDENTS_LIST_BY_TEAM_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_TEAM_ERROR,
  FILTER_INCIDENTS_LIST_BY_SERVICE,
  FILTER_INCIDENTS_LIST_BY_SERVICE_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_SERVICE_ERROR,
  FILTER_INCIDENTS_LIST_BY_QUERY,
  FILTER_INCIDENTS_LIST_BY_QUERY_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_QUERY_ERROR,
} from './actions';
import selectIncidents from './selectors';

export const getIncidentByIdRequest = (incidentId) => call(pd, {
  method: 'get',
  endpoint: `incidents/${incidentId}`,
  data: {
    'include[]': ['external_references'],
  },
});

export function* getIncidentsAsync() {
  yield takeLatest(FETCH_INCIDENTS_REQUESTED, getIncidents);
}

export function* getIncidents() {
  try {
    //  Build params from query settings and call pd lib
    const {
      sinceDate,
      incidentStatus,
      incidentUrgency,
      teamIds,
      serviceIds,
      incidentPriority,
      searchQuery,
    } = yield select(selectQuerySettings);

    const params = {
      since: sinceDate.toISOString(),
      until: new Date().toISOString(),
      include: ['first_trigger_log_entries', 'external_references'],
    };

    if (incidentStatus) params.statuses = incidentStatus;
    if (incidentUrgency) params.urgencies = incidentUrgency;
    if (teamIds.length) params.team_ids = teamIds;
    if (serviceIds.length) params.service_ids = serviceIds;

    const fetchedIncidents = yield pdParallelFetch('incidents', params);

    // Sort incidents by reverse created_at date (i.e. recent incidents at the top)
    fetchedIncidents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // FIXME: Temporary fix for batched calls over prescribed limit - need to use new API library
    const incidents = fetchedIncidents.slice(0, MAX_INCIDENTS_LIMIT);

    yield put({
      type: FETCH_INCIDENTS_COMPLETED,
      incidents,
    });

    // Filter incident list on priority (can't do this from API)
    yield call(filterIncidentsByPriorityImpl, { incidentPriority });

    // Filter updated incident list by query; updates memoized data within incidents table
    yield call(filterIncidentsByQueryImpl, { searchQuery });
  } catch (e) {
    yield put({ type: FETCH_INCIDENTS_ERROR, message: e.message });
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: 'Unable to fetch incidents',
    });
  }
}

export function* getIncidentNotesAsync() {
  yield takeEvery(FETCH_INCIDENT_NOTES_REQUESTED, getIncidentNotes);
}

export function* getIncidentNotes(action) {
  try {
    // Call PD API to grab note for given Incident ID
    const {
      incidentId,
    } = action;
    const response = yield call(pd.get, `incidents/${incidentId}/notes`);
    const {
      notes,
    } = response.data;

    // Grab matching incident and apply note update
    const {
      incidents,
    } = yield select(selectIncidents);
    const updatedIncidentsList = incidents.map((incident) => {
      if (incident.id === incidentId) {
        const tempIncident = { ...incident };
        tempIncident.notes = notes;
        return tempIncident;
      }
      return incident;
    });

    // Update store with incident having notes data
    yield put({
      type: FETCH_INCIDENT_NOTES_COMPLETED,
      incidents: updatedIncidentsList,
    });
  } catch (e) {
    yield put({ type: FETCH_INCIDENT_NOTES_ERROR, message: e.message });
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: 'Unable to fetch incident notes',
    });
  }
}

export function* getAllIncidentNotesAsync() {
  yield takeEvery(FETCH_ALL_INCIDENT_NOTES_REQUESTED, getAllIncidentNotes);
}

export function* getAllIncidentNotes() {
  try {
    // Wait until incidents have been fetched before obtaining notes
    yield take([FETCH_INCIDENTS_COMPLETED, FETCH_INCIDENTS_ERROR]);

    // Build list of promises to call PD endpoint
    const {
      incidents,
    } = yield select(selectIncidents);
    const requests = incidents.map(({
      id,
    }) => throttledPdAxiosRequest('GET', `incidents/${id}/notes`));
    const results = yield Promise.all(requests);

    // Grab matching incident and apply note update
    const updatedIncidentsList = incidents.map((incident, idx) => {
      const tempIncident = { ...incident };
      tempIncident.notes = results[idx].data.notes;
      return tempIncident;
    });

    // Update store with incident having notes data
    yield put({
      type: FETCH_ALL_INCIDENT_NOTES_COMPLETED,
      incidents: updatedIncidentsList,
    });

    /*
      Apply filters that already are configured down below
    */
    const {
      incidentPriority, incidentStatus, incidentUrgency, teamIds, serviceIds, searchQuery,
    } = yield select(selectQuerySettings);

    // Filter updated incident list on priority (can't do this from API)
    yield call(filterIncidentsByPriorityImpl, { incidentPriority });

    // Filter updated incident list on status
    yield call(filterIncidentsByStatusImpl, { incidentStatus });

    // Filter updated incident list on urgency
    yield call(filterIncidentsByUrgencyImpl, { incidentUrgency });

    // Filter updated incident list on team
    yield call(filterIncidentsByTeamImpl, { teamIds });

    // // Filter updated incident list on service
    yield call(filterIncidentsByServiceImpl, { serviceIds });

    // Filter updated incident list by query
    yield call(filterIncidentsByQueryImpl, { searchQuery });
  } catch (e) {
    yield put({ type: FETCH_ALL_INCIDENT_NOTES_ERROR, message: e.message });
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: 'Unable to fetch all incident notes',
    });
  }
}

export function* getAllIncidentAlertsAsync() {
  yield takeEvery(FETCH_ALL_INCIDENT_ALERTS_REQUESTED, getAllIncidentAlerts);
}

export function* getAllIncidentAlerts() {
  try {
    // Wait until incidents & notes have been fetched before obtaining alerts
    yield take([FETCH_ALL_INCIDENT_NOTES_COMPLETED, FETCH_ALL_INCIDENT_NOTES_ERROR]);

    // Build list of promises to call PD endpoint
    const {
      incidents,
    } = yield select(selectIncidents);
    const requests = incidents.map(({
      id,
    }) => throttledPdAxiosRequest('GET', `incidents/${id}/alerts`));
    const results = yield Promise.all(requests);

    // Grab matching incident and apply note update
    const updatedIncidentsList = incidents.map((incident, idx) => {
      const tempIncident = { ...incident };
      tempIncident.alerts = results[idx].data.alerts;
      return tempIncident;
    });

    // Update store with incident having alerts data
    yield put({
      type: FETCH_ALL_INCIDENT_ALERTS_COMPLETED,
      incidents: updatedIncidentsList,
    });

    /*
      Apply filters that already are configured down below
    */
    const {
      incidentPriority, incidentStatus, incidentUrgency, teamIds, serviceIds, searchQuery,
    } = yield select(selectQuerySettings);
    yield call(filterIncidentsByPriorityImpl, { incidentPriority });
    yield call(filterIncidentsByStatusImpl, { incidentStatus });
    yield call(filterIncidentsByUrgencyImpl, { incidentUrgency });
    yield call(filterIncidentsByTeamImpl, { teamIds });
    yield call(filterIncidentsByServiceImpl, { serviceIds });
    yield call(filterIncidentsByQueryImpl, { searchQuery });
  } catch (e) {
    yield put({ type: FETCH_ALL_INCIDENT_ALERTS_ERROR, message: e.message });
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: 'Unable to fetch all incident alerts',
    });
  }
}

export function* updateIncidentsListAsync() {
  yield takeEvery(UPDATE_INCIDENTS_LIST, updateIncidentsList);
}

export function* updateIncidentsList(action) {
  try {
    const {
      addList, updateList, removeList,
    } = action;
    const {
      incidents,
    } = yield select(selectIncidents);
    const {
      incidentPriority, incidentStatus, incidentUrgency, teamIds, serviceIds, searchQuery,
    } = yield select(selectQuerySettings);
    const {
      alerts,
    } = yield select(selectLogEntries);
    let updatedIncidentsList = [...incidents];

    // Add new incidents to list (need to re-query to get external_references + notes)
    const addListRequests = addList.map((addItem) => {
      if (addItem.incident) return getIncidentByIdRequest(addItem.incident.id);
    });
    const addListResponses = yield all(addListRequests);
    const addListNoteRequests = addList.map((addItem) => {
      if (addItem.incident) return call(pd.get, `incidents/${addItem.incident.id}/notes`);
    });
    const addListNoteResponses = yield all(addListNoteRequests);

    // Synthetically create notes + alerts object to be added to new incident
    addListResponses.map((response, idx) => {
      const {
        notes,
      } = addListNoteResponses[idx].response.data;
      const newIncident = { ...response.data.incident };
      newIncident.notes = notes;
      newIncident.alerts = alerts.filter((alert) => alert.incident.id === newIncident.id);
      updatedIncidentsList.push(newIncident);
    });

    // Update existing incidents within list
    if (incidents.length && updateList.length) {
      updatedIncidentsList = updatedIncidentsList.map((existingIncident) => {
        const updatedItem = updateList.find((updateItem) => {
          if (updateItem.incident) return updateItem.incident.id === existingIncident.id;
        });
        const updatedIncident = updatedItem ? updatedItem.incident : null;
        return updatedIncident ? { ...existingIncident, ...updatedIncident } : existingIncident;
      });
    }

    // Handle where new updates come in against an empty incident list or filtered out incidents
    if (updateList.length) {
      updateList.map((updateItem) => {
        if (updateItem.incident) {
          // Check if item is matched against updatedIncidentsList (skip)
          if (updatedIncidentsList.find((incident) => incident.id === updateItem.incident.id)) {
            return;
          }
          // Update incident list (push if we haven't updated already)
          pushToArray(updatedIncidentsList, updateItem.incident, 'id');
        }
      });
    }

    // Remove incidents within list
    updatedIncidentsList = updatedIncidentsList.filter(
      (existingIncident) => !removeList.some((removeItem) => {
        if (removeItem.incident) return removeItem.incident.id === existingIncident.id;
      }),
    );

    // Sort incidents by reverse created_at date (i.e. recent incidents at the top)
    updatedIncidentsList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Remove any unintentional duplicate incidents (i.e. new incident triggered)
    const updatedIncidentsIds = updatedIncidentsList.map((o) => o.id);
    const uniqueUpdatedIncidentsList = updatedIncidentsList.filter(
      ({
        id,
      }, index) => !updatedIncidentsIds.includes(id, index + 1),
    );

    // Update store with updated list of incidents
    yield put({
      type: UPDATE_INCIDENTS_LIST_COMPLETED,
      incidents: uniqueUpdatedIncidentsList,
    });

    /*
      Apply filters that already are configured down below
    */

    // Filter updated incident list on priority (can't do this from API)
    yield call(filterIncidentsByPriorityImpl, { incidentPriority });

    // Filter updated incident list on status
    yield call(filterIncidentsByStatusImpl, { incidentStatus });

    // Filter updated incident list on urgency
    yield call(filterIncidentsByUrgencyImpl, { incidentUrgency });

    // Filter updated incident list on team
    yield call(filterIncidentsByTeamImpl, { teamIds });

    // // Filter updated incident list on service
    yield call(filterIncidentsByServiceImpl, { serviceIds });

    // Filter updated incident list by query
    yield call(filterIncidentsByQueryImpl, { searchQuery });
  } catch (e) {
    yield put({ type: UPDATE_INCIDENTS_LIST_ERROR, message: e.message });
  }
}

export function* filterIncidentsByPriority() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_PRIORITY, filterIncidentsByPriorityImpl);
}

export function* filterIncidentsByPriorityImpl(action) {
  // Filter current incident list by priority
  try {
    const {
      incidentPriority,
    } = action;
    const {
      incidents,
    } = yield select(selectIncidents);
    const filteredIncidentsByPriorityList = incidents.filter((incident) => {
      // Incident priority is not always defined - need to check this
      if (incident.priority && incidentPriority.includes(incident.priority.id)) return incident;

      if (!incident.priority && incidentPriority.includes('--')) return incident;
    });
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_PRIORITY_COMPLETED,
      incidents: filteredIncidentsByPriorityList,
    });
  } catch (e) {
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_PRIORITY_ERROR,
      message: e.message,
    });
  }
}

export function* filterIncidentsByStatus() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_STATUS, filterIncidentsByStatusImpl);
}

export function* filterIncidentsByStatusImpl(action) {
  // Filter current incident list by status
  try {
    const {
      incidentStatus,
    } = action;
    const {
      incidents,
    } = yield select(selectIncidents);
    const filteredIncidentsByStatusList = filterIncidentsByField(
      incidents,
      'status',
      incidentStatus,
    );
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_STATUS_COMPLETED,
      incidents: filteredIncidentsByStatusList,
    });
  } catch (e) {
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_STATUS_ERROR,
      message: e.message,
    });
  }
}

export function* filterIncidentsByUrgency() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_URGENCY, filterIncidentsByUrgencyImpl);
}

export function* filterIncidentsByUrgencyImpl(action) {
  // Filter current incident list by urgency
  try {
    const {
      incidentUrgency,
    } = action;
    const {
      incidents,
    } = yield select(selectIncidents);
    const filteredIncidentsByUrgencyList = filterIncidentsByField(
      incidents,
      'urgency',
      incidentUrgency,
    );
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_URGENCY_COMPLETED,
      incidents: filteredIncidentsByUrgencyList,
    });
  } catch (e) {
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_URGENCY_ERROR,
      message: e.message,
    });
  }
}

export function* filterIncidentsByTeam() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_TEAM, filterIncidentsByTeamImpl);
}

export function* filterIncidentsByTeamImpl(action) {
  // Filter current incident list by team - assume no team set means show everything
  try {
    const {
      teamIds,
    } = action;
    const {
      incidents,
    } = yield select(selectIncidents);
    let filteredIncidentsByTeamList;

    // Typically there is no filtered view by teams, so if empty, show all teams.
    if (teamIds.length) {
      filteredIncidentsByTeamList = filterIncidentsByFieldOfList(incidents, 'teams', 'id', teamIds);
    } else {
      filteredIncidentsByTeamList = [...incidents];
    }

    yield put({
      type: FILTER_INCIDENTS_LIST_BY_TEAM_COMPLETED,
      incidents: filteredIncidentsByTeamList,
    });
  } catch (e) {
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_TEAM_ERROR,
      message: e.message,
    });
  }
}

export function* filterIncidentsByService() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_SERVICE, filterIncidentsByServiceImpl);
}

export function* filterIncidentsByServiceImpl(action) {
  // Filter current incident list by service
  try {
    const {
      serviceIds,
    } = action;
    const {
      incidents,
    } = yield select(selectIncidents);
    let filteredIncidentsByServiceList;

    // Typically there is no filtered view by services, so if empty, show all services.
    if (serviceIds.length) {
      filteredIncidentsByServiceList = filterIncidentsByField(incidents, 'service.id', serviceIds);
    } else {
      filteredIncidentsByServiceList = [...incidents];
    }

    yield put({
      type: FILTER_INCIDENTS_LIST_BY_SERVICE_COMPLETED,
      incidents: filteredIncidentsByServiceList,
    });
  } catch (e) {
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_SERVICE_ERROR,
      message: e.message,
    });
  }
}

export function* filterIncidentsByQuery() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_QUERY, filterIncidentsByQueryImpl);
}

export function* filterIncidentsByQueryImpl(action) {
  // Filter current incident list by query (aka Global Search)
  try {
    const {
      searchQuery,
    } = action;
    const {
      incidents,
    } = yield select(selectIncidents);
    const {
      incidentTableColumns,
    } = yield select(selectIncidentTable);
    let filteredIncidentsByQuery;

    // Update Fuse options to include custom alert JSON to be searched
    const updatedFuseOptions = { ...fuseOptions };
    const customAlertDetailColumnKeys = incidentTableColumns
      .filter((col) => !!col.accessorPath)
      .map((col) => `alerts.body.cef_details.${col.accessorPath}`);
    updatedFuseOptions.keys = fuseOptions.keys.concat(customAlertDetailColumnKeys);

    // Run query with non-empty input
    if (searchQuery !== '') {
      const fuse = new Fuse(incidents, updatedFuseOptions);
      filteredIncidentsByQuery = fuse.search(searchQuery).map((res) => res.item);
    } else {
      filteredIncidentsByQuery = [...incidents];
    }

    yield put({
      type: FILTER_INCIDENTS_LIST_BY_QUERY_COMPLETED,
      filteredIncidentsByQuery,
    });
  } catch (e) {
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_QUERY_ERROR,
      message: e.message,
    });
  }
}
