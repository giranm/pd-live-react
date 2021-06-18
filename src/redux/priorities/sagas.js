/* eslint-disable array-callback-return */
import { put, call, select, takeLatest } from "redux-saga/effects";
import { api } from '@pagerduty/pdjs';

import {
  FETCH_PRIORITIES_REQUESTED,
  FETCH_PRIORITIES_COMPLETED,
  FETCH_PRIORITIES_ERROR,
} from "./actions";

import { selectPriorities } from "./selectors";

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

export function* getPrioritiesAsync() {
  yield takeLatest(FETCH_PRIORITIES_REQUESTED, getPriorities);
};

export function* getPriorities() {
  try {
    //  Create params and call pd lib
    let response = yield call(pd.all, "priorities");

    yield put({
      type: FETCH_PRIORITIES_COMPLETED,
      priorities: response.resource
    });

  } catch (e) {
    yield put({ type: FETCH_PRIORITIES_ERROR, message: e.message });
  }
};