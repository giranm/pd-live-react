import { put, call, select, takeLatest } from "redux-saga/effects";
import { api } from '@pagerduty/pdjs';

import {
  FETCH_LOG_ENTRIES_REQUESTED,
  FETCH_LOG_ENTRIES_COMPLETED,
  FETCH_LOG_ENTRIES_ERROR,
  UPDATE_RECENT_LOG_ENTRIES,
  UPDATE_RECENT_LOG_ENTRIES_COMPLETED,
  UPDATE_RECENT_LOG_ENTRIES_ERROR
} from "./actions";

import { selectLogEntries } from "./selectors";

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

export function* getLogEntriesAsync() {
  yield takeLatest(FETCH_LOG_ENTRIES_REQUESTED, getLogEntries);
}

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
    yield put({ type: UPDATE_RECENT_LOG_ENTRIES })

  } catch (e) {
    yield put({ type: FETCH_LOG_ENTRIES_ERROR, message: e.message });
  }
}


export function* updateRecentLogEntriesAsync() {
  yield takeLatest(UPDATE_RECENT_LOG_ENTRIES, updateRecentLogEntries);
}

export function* updateRecentLogEntries(action) {
  try {
    // Grab log entries from store and determine what is recent based on last polling
    let { logEntries } = yield select(selectLogEntries)
    let recentLogEntries = []
    for (let logEntry in logEntries) {

      if (recentLogEntries.filter(x => x.id === logEntry.id).length > 0) {
        // console.log(`duplicate log entry ${logEntry.id}`)
        continue
      }
      let logEntryDate = new Date(logEntry.created_at)
      recentLogEntries.push({
        date: logEntryDate,
        id: logEntry.id
      })
      if (logEntryDate > last_polled) {
        last_polled = log_entry_date
      }
      let incident_id = logEntry.incident.id
      let entry_type = logEntry.type

      if (entry_type === 'resolve_log_entry') {
        remove_set.add(logEntry)
      } else if (entry_type === 'trigger_log_entry') {
        add_set.add(logEntry)
      } else {
        update_set.add(logEntry)
      }


    }



    yield put({ type: UPDATE_RECENT_LOG_ENTRIES_COMPLETED, recentLogEntries: [1, 2, 3] })
  } catch (e) {
    yield put({ type: UPDATE_RECENT_LOG_ENTRIES_ERROR, message: e.message });
  }
}