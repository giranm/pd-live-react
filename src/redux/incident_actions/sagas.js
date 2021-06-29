/* eslint-disable array-callback-return */
import { put, call, select, takeLatest } from "redux-saga/effects";
import { api } from '@pagerduty/pdjs';

import {
  ACKNOWLEDGE_REQUESTED,
  ACKNOWLEDGE_COMPLETED,
  ACKNOWLEDGE_ERROR,
} from "./actions";

import { selectIncidentActions } from "./selectors";

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

export function* acknowledgeAsync() {
  yield takeLatest(ACKNOWLEDGE_REQUESTED, acknowledge);
};

export function* acknowledge(action) {
  try {
    //  Create params and call pd lib
    let { incidents } = action;
    console.log("Sagas", incidents);

    // let response = yield call(pd.all, "services", { data: { ...params } });

    // yield put({
    //   type: ACKNOWLEDGE_COMPLETED,
    //   acknowledgedIncidents: response.resource
    // });

  } catch (e) {
    console.log("Err", e)
    yield put({ type: ACKNOWLEDGE_ERROR, message: e.message });
  }
};