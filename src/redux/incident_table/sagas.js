/* eslint-disable array-callback-return */
import { put, select, takeLatest } from "redux-saga/effects";

import {
  TOGGLE_INCIDENT_TABLE_SETTINGS_REQUESTED,
  TOGGLE_INCIDENT_TABLE_SETTINGS_COMPLETED,
  UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED,
  UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED,
  UPDATE_TEMP_INCIDENT_TABLE_COLUMNS_REQUESTED,
  UPDATE_TEMP_INCIDENT_TABLE_COLUMNS_COMPLETED,
} from "./actions";

import { selectIncidentTableSettings, selectTempIncidentTableSettings } from "./selectors";

export function* toggleIncidentTableSettings() {
  yield takeLatest(TOGGLE_INCIDENT_TABLE_SETTINGS_REQUESTED, toggleIncidentTableSettingsImpl);
};

export function* toggleIncidentTableSettingsImpl() {
  let { displayIncidentTableSettings } = yield select(selectIncidentTableSettings);
  yield put({ type: TOGGLE_INCIDENT_TABLE_SETTINGS_COMPLETED, displayIncidentTableSettings: !displayIncidentTableSettings });
};

export function* updateIncidentTableColumns() {
  yield takeLatest(UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED, updateIncidentTableColumnsImpl);
};

export function* updateIncidentTableColumnsImpl(action) {
  let { incidentTableColumns } = action;
  yield put({ type: UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED, incidentTableColumns });
};

export function* updateTempIncidentTableColumns() {
  yield takeLatest(UPDATE_TEMP_INCIDENT_TABLE_COLUMNS_REQUESTED, updateTempIncidentTableColumnsImpl);
};

export function* updateTempIncidentTableColumnsImpl(action) {
  let { incidentTableColumns } = action;
  yield put({ type: UPDATE_TEMP_INCIDENT_TABLE_COLUMNS_COMPLETED, incidentTableColumns });
};