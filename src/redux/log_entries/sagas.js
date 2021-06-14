import { put, call, select, takeLatest } from "redux-saga/effects";
import { api } from '@pagerduty/pdjs';

import {
  FETCH_LOG_ENTRIES_REQUESTED,
  FETCH_LOG_ENTRIES_COMPLETED,
  FETCH_LOG_ENTRIES_ERROR,
  UPDATE_RECENT_LOG_ENTRIES,
  UPDATE_RECENT_LOG_ENTRIES_COMPLETED,
  UPDATE_RECENT_LOG_ENTRIES_ERROR,
  CLEAN_RECENT_LOG_ENTRIES,
  CLEAN_RECENT_LOG_ENTRIES_COMPLETED,
  CLEAN_RECENT_LOG_ENTRIES_ERROR
} from "./actions";

import { UPDATE_INCIDENTS_LIST } from "redux/incidents/actions";

import { selectLogEntries } from "./selectors";

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

export function* getLogEntriesAsync() {
  yield takeLatest(FETCH_LOG_ENTRIES_REQUESTED, getLogEntries);
};

export function* getLogEntries(action) {
  try {
    //  Create params and call pd lib
    let { since } = action;
    let params = {
      since: since.toISOString().replace(/\.[\d]{3}/, ''),
      'include[]': ['incidents'],
    };
    let response = yield call(pd.all, "log_entries", { data: { ...params } });
    let logEntries = response.resource;

    yield put({ type: FETCH_LOG_ENTRIES_COMPLETED, logEntries });

    // Call to update recent log entries with this data.
    yield put({ type: UPDATE_RECENT_LOG_ENTRIES });

  } catch (e) {
    yield put({ type: FETCH_LOG_ENTRIES_ERROR, message: e.message });
  }
};


export function* updateRecentLogEntriesAsync() {
  yield takeLatest(UPDATE_RECENT_LOG_ENTRIES, updateRecentLogEntries);
};

export function* updateRecentLogEntries(action) {
  try {
    // Grab log entries from store and determine what is recent based on last polling
    let { logEntries, recentLogEntries } = yield select(selectLogEntries);
    let recentLogEntriesLocal = [...recentLogEntries];
    let addSet = new Set();
    let removeSet = new Set();
    let updateSet = new Set();

    logEntries.forEach((logEntry) => {
      // Skip duplicate log entry
      if (recentLogEntriesLocal.filter(x => x.id === logEntry.id).length > 0)
        return;

      // Push new log entry to array with details
      let logEntryDate = new Date(logEntry.created_at);
      recentLogEntriesLocal.push({
        date: logEntryDate,
        id: logEntry.id
      });

      // Find out what incidents need to be updated based on log entry type
      let entryType = logEntry.type;
      if (entryType === 'resolve_log_entry') {
        removeSet.add(logEntry);
      } else if (entryType === 'trigger_log_entry') {
        addSet.add(logEntry);
      } else {
        updateSet.add(logEntry);
      }

    });

    // Generate update lists from sets
    let addList = [...addSet].filter(x => !removeSet.has(x));
    let updateList = [...updateSet].filter(x => !removeSet.has(x) && !addSet.has(x));
    let removeList = [...removeSet];

    // Update recent log entries and dispatch update incident list
    yield put({ type: UPDATE_RECENT_LOG_ENTRIES_COMPLETED, recentLogEntries: recentLogEntriesLocal });
    yield put({ type: UPDATE_INCIDENTS_LIST, addList, updateList, removeList });

  } catch (e) {
    yield put({ type: UPDATE_RECENT_LOG_ENTRIES_ERROR, message: e.message });
  }
};

export function* cleanRecentLogEntriesAsync() {
  yield takeLatest(CLEAN_RECENT_LOG_ENTRIES, cleanRecentLogEntries);
};

export function* cleanRecentLogEntries(action) {
  try {
    // Sort recent log entries by descending date and reduce this down to the last 100 items
    let { recentLogEntries } = yield select(selectLogEntries);
    let cleanedRecentLogEntries = [...recentLogEntries];
    cleanedRecentLogEntries.sort((a, b) => b.date - a.date).slice(0, 100);

    yield put({ type: CLEAN_RECENT_LOG_ENTRIES_COMPLETED, recentLogEntries: cleanedRecentLogEntries });

  } catch (e) {
    yield put({ type: CLEAN_RECENT_LOG_ENTRIES_ERROR, message: e.message });
  }
};