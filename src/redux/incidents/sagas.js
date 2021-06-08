import { put, takeLatest, call } from "redux-saga/effects";
import { api } from '@pagerduty/pdjs';

import { FETCH_INCIDENTS_REQUESTED, FETCH_INCIDENTS_COMPLETED, FETCH_INCIDENTS_ERROR } from "./actions";

const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

const pdfetch = (endpoint, params) => {
  console.log("Fetching from pdfetch", endpoint, params)
  const myParams = { ...params }
  const endpoint_identifier = endpoint.split('/').pop()
  let r = []
  // const responses = await this.pd.all({ token: this.token, tokenType: 'bearer', endpoint: `/${endpoint}`, data: myParams })
  let responses = pd.all({ endpoint: `/${endpoint}`, data: myParams })
  for (let response of responses) {
    r = [...r, ...response.data[endpoint_identifier]]
  }
  return r
}

export function* getIncidents(action) {
  try {
    let params = {
      since: new Date("2021-06-08").toISOString(),
      until: new Date().toISOString(),
      'include[]': 'first_trigger_log_entries',
      'statuses[]': ['triggered', 'acknowledged']
    }

    console.log("Fetching incidents")
    // let incidents = yield call(pdfetch, "incidents", params) // Need to fix this
    let incidents = [1, 2, 3, 4]
    console.log(incidents)

    yield put({
      type: FETCH_INCIDENTS_COMPLETED,
      incidents
    });

  } catch (e) {
    yield put({ type: FETCH_INCIDENTS_ERROR, message: e.message })
  }
}

export function* getIncidentsAsync() {
  yield takeLatest(FETCH_INCIDENTS_REQUESTED, getIncidents);
}