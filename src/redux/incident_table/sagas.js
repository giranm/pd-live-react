import {
  put, takeLatest,
} from 'redux-saga/effects';

import {
  SAVE_INCIDENT_TABLE_SETTINGS_REQUESTED,
  SAVE_INCIDENT_TABLE_SETTINGS_COMPLETED,
  SAVE_INCIDENT_TABLE_SETTINGS_ERROR,
  UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED,
  UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED,
  UPDATE_INCIDENT_TABLE_STATE_REQUESTED,
  UPDATE_INCIDENT_TABLE_STATE_COMPLETED,
  SELECT_INCIDENT_TABLE_ROWS_REQUESTED,
  SELECT_INCIDENT_TABLE_ROWS_COMPLETED,
} from './actions';

export function* saveIncidentTable() {
  yield takeLatest(SAVE_INCIDENT_TABLE_SETTINGS_REQUESTED, saveIncidentTableImpl);
}

export function* saveIncidentTableImpl(action) {
  // Attempt saving each setting down by dispatching the relevant actions
  try {
    const {
      updatedIncidentTableColumns,
    } = action;

    // Update incident table columns
    const updatedIncidentTableColumnNames = updatedIncidentTableColumns.map((col) => col.value);
    yield put({
      type: UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED,
      incidentTableColumnsNames: updatedIncidentTableColumnNames,
    });

    // TODO: Other table settings can be dispatched here...

    // Indicate that changes were saved and close down settings modal.
    yield put({ type: SAVE_INCIDENT_TABLE_SETTINGS_COMPLETED });
  } catch (e) {
    yield put({ type: SAVE_INCIDENT_TABLE_SETTINGS_ERROR, message: e.message });
  }
}

export function* updateIncidentTableColumns() {
  yield takeLatest(UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED, updateIncidentTableColumnsImpl);
}

export function* updateIncidentTableColumnsImpl(action) {
  const {
    incidentTableColumnsNames,
  } = action;
  yield put({
    type: UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED,
    incidentTableColumnsNames,
  });
}

export function* updateIncidentTableState() {
  yield takeLatest(UPDATE_INCIDENT_TABLE_STATE_REQUESTED, updateIncidentTableStateImpl);
}

export function* updateIncidentTableStateImpl(action) {
  const {
    incidentTableState,
  } = action;
  yield put({
    type: UPDATE_INCIDENT_TABLE_STATE_COMPLETED,
    incidentTableState,
  });
}

export function* selectIncidentTableRows() {
  yield takeLatest(SELECT_INCIDENT_TABLE_ROWS_REQUESTED, selectIncidentTableRowsImpl);
}

export function* selectIncidentTableRowsImpl(action) {
  const {
    allSelected, selectedCount, selectedRows,
  } = action;
  yield put({
    type: SELECT_INCIDENT_TABLE_ROWS_COMPLETED,
    allSelected,
    selectedCount,
    selectedRows,
  });
}
