/* eslint-disable array-callback-return */
import { put, select, takeLatest } from "redux-saga/effects";

import {
  UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED,
  UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED
} from "./actions";

import { selectIncidentTableSettings } from "./selectors";

export function* updateIncidentTableColumns() {
  yield takeLatest(UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED, updateIncidentTableColumnsImpl);
};

export function* updateIncidentTableColumnsImpl(action) {
  let { incidentTableColumns } = action;
  yield put({ type: UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED, incidentTableColumns });
};