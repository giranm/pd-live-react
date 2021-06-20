/* eslint-disable array-callback-return */
import { put, call, select, takeLatest } from "redux-saga/effects";

import {
  TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED,
  TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED,
  UPDATE_QUERY_SETTING_SINCE_DATE_REQUESTED,
  UPDATE_QUERY_SETTING_SINCE_DATE_COMPLETED
} from "./actions";

import {
  FETCH_INCIDENTS_REQUESTED
} from "redux/incidents/actions"

import { selectQuerySettings } from "./selectors";

export function* toggleDisplayQuerySettings() {
  yield takeLatest(TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED, toggleDisplayQuerySettingsImpl);
};

export function* toggleDisplayQuerySettingsImpl() {
  let { displayQuerySettings } = yield select(selectQuerySettings);
  yield put({ type: TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED, displayQuerySettings: !displayQuerySettings });
};

export function* updateQuerySettingsSinceDate() {
  yield takeLatest(UPDATE_QUERY_SETTING_SINCE_DATE_REQUESTED, updateQuerySettingsSinceDateImpl);
};

export function* updateQuerySettingsSinceDateImpl(action) {
  // Update since date and re-request incidents list
  let { sinceDate } = action;
  yield put({ type: UPDATE_QUERY_SETTING_SINCE_DATE_COMPLETED, sinceDate });
  // yield put({ type: FETCH_INCIDENTS_REQUESTED, since: sinceDate }); // TODO: Fix this incorrect args and redispatching
};