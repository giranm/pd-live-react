/* eslint-disable array-callback-return */
import { put, call, select, takeLatest } from "redux-saga/effects";

import {
  TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED,
  TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED
} from "./actions";

import { selectQuerySettings } from "./selectors";

export function* toggleDisplayQuerySettings() {
  yield takeLatest(TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED, toggleDisplayQuerySettingsImpl);
};

export function* toggleDisplayQuerySettingsImpl() {
  let { displayQuerySettings } = yield select(selectQuerySettings);
  yield put({ type: TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED, displayQuerySettings: !displayQuerySettings });
};