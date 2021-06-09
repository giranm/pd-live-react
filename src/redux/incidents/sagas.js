import { put, takeLatest, call } from "redux-saga/effects";
import { api } from '@pagerduty/pdjs';

import { FETCH_INCIDENTS_REQUESTED, FETCH_INCIDENTS_COMPLETED, FETCH_INCIDENTS_ERROR } from "./actions";

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

export function* getIncidents(action) {
  try {
    //  Create params and call pd lib
    let { since, until } = action;
    let params = {
      since: since.toISOString(),
      until: until.toISOString(),
      'include[]': 'first_trigger_log_entries',
      'statuses[]': ['triggered', 'acknowledged']
    }
    let response = yield call(pd.all, "incidents", { data: { ...params } })

    yield put({
      type: FETCH_INCIDENTS_COMPLETED,
      incidents: response.resource
    });

  } catch (e) {
    yield put({ type: FETCH_INCIDENTS_ERROR, message: e.message })
  }
}

export function* getIncidentsAsync() {
  yield takeLatest(FETCH_INCIDENTS_REQUESTED, getIncidents);
}