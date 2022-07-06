import {
  put, takeLatest, select, take,
} from 'redux-saga/effects';

// eslint-disable-next-line import/no-cycle
import {
  getReactTableColumnSchemas,
} from 'config/incident-table-columns';

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

import selectIncidentTable from './selectors';

export function* saveIncidentTable() {
  yield takeLatest(SAVE_INCIDENT_TABLE_SETTINGS_REQUESTED, saveIncidentTableImpl);
}

export function* saveIncidentTableImpl(action) {
  // Attempt saving each setting down by dispatching the relevant actions
  try {
    take([UPDATE_INCIDENT_TABLE_STATE_COMPLETED]);
    const {
      incidentTableColumns, incidentTableState,
    } = yield select(selectIncidentTable);
    const {
      updatedIncidentTableColumns,
    } = action;

    // Merge state from incident table and defined columns.
    const reactTableColumns = getReactTableColumnSchemas(updatedIncidentTableColumns);
    const columnWidths = incidentTableState.columnResizing
      ? incidentTableState.columnResizing.columnWidths
      : null;
    const mappedCols = reactTableColumns.map((col) => {
      const existingCol = incidentTableColumns.find((c) => c.Header === col.Header);
      const tempCol = { ...col };
      if (columnWidths && tempCol.accessor in columnWidths) {
        tempCol.width = columnWidths[tempCol.accessor];
        console.log('Width from cached table by accessor', tempCol);
      } else if (columnWidths && tempCol.Header in columnWidths) {
        tempCol.width = columnWidths[tempCol.Header];
        console.log('Width from cached table by Header', tempCol);
      } else if (existingCol && existingCol.width) {
        tempCol.width = existingCol.width;
        console.log('Width from existing redux store', tempCol);
      } else {
        tempCol.width = tempCol.minWidth;
        console.log('Width from default', tempCol);
      }
      return { Header: tempCol.Header, width: tempCol.width, columnType: tempCol.columnType };
    });

    console.log('Current incidentTableColumns', incidentTableColumns);
    console.log('updated incidentTableColumns', updatedIncidentTableColumns);
    console.log('reactTableColumnsSchema', reactTableColumns);
    console.log('incidentTableState', incidentTableState);
    console.log('mappedCols', mappedCols);

    // Update incident table columns
    yield put({
      type: UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED,
      incidentTableColumns: mappedCols,
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
    incidentTableColumns,
  } = action;
  yield put({
    type: UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED,
    incidentTableColumns,
  });
}

export function* updateIncidentTableState() {
  yield takeLatest(UPDATE_INCIDENT_TABLE_STATE_REQUESTED, updateIncidentTableStateImpl);
}

export function* updateIncidentTableStateImpl(action) {
  const {
    incidentTableState,
  } = action;
  console.log('incidentTableState', incidentTableState);
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
