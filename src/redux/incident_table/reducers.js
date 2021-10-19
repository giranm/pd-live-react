import produce from 'immer';

import { getIncidentTableColumns } from 'util/incident-table-columns';
import {
  TOGGLE_INCIDENT_TABLE_SETTINGS_REQUESTED,
  TOGGLE_INCIDENT_TABLE_SETTINGS_COMPLETED,
  SAVE_INCIDENT_TABLE_SETTINGS_REQUESTED,
  SAVE_INCIDENT_TABLE_SETTINGS_COMPLETED,
  SAVE_INCIDENT_TABLE_SETTINGS_ERROR,
  UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED,
  UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED,
  SELECT_INCIDENT_TABLE_ROWS_REQUESTED,
  SELECT_INCIDENT_TABLE_ROWS_COMPLETED,
} from './actions';

const defaultColumnNames = [
  '#',
  'Status',
  'Priority',
  'Title',
  'Assignees',
  'Created At',
  'Service',
  'Latest Note',
];

const incidentTableSettings = produce(
  (draft, action) => {
    switch (action.type) {
      case TOGGLE_INCIDENT_TABLE_SETTINGS_REQUESTED:
        draft.status = TOGGLE_INCIDENT_TABLE_SETTINGS_REQUESTED;
        break;

      case TOGGLE_INCIDENT_TABLE_SETTINGS_COMPLETED:
        draft.displayIncidentTableSettings = action.displayIncidentTableSettings;
        draft.status = TOGGLE_INCIDENT_TABLE_SETTINGS_COMPLETED;
        break;

      case SAVE_INCIDENT_TABLE_SETTINGS_REQUESTED:
        draft.status = SAVE_INCIDENT_TABLE_SETTINGS_REQUESTED;
        break;

      case SAVE_INCIDENT_TABLE_SETTINGS_COMPLETED:
        draft.status = SAVE_INCIDENT_TABLE_SETTINGS_COMPLETED;
        break;

      case SAVE_INCIDENT_TABLE_SETTINGS_ERROR:
        draft.error = action.message;
        draft.status = SAVE_INCIDENT_TABLE_SETTINGS_ERROR;
        break;

      case UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED:
        draft.status = UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED;
        break;

      case UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED:
        draft.incidentTableColumns = action.incidentTableColumns;
        draft.status = UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED;
        break;

      case SELECT_INCIDENT_TABLE_ROWS_REQUESTED:
        draft.status = SELECT_INCIDENT_TABLE_ROWS_REQUESTED;
        break;

      case SELECT_INCIDENT_TABLE_ROWS_COMPLETED:
        draft.allSelected = action.allSelected;
        draft.selectedCount = action.selectedCount;
        draft.selectedRows = action.selectedRows;
        draft.status = SELECT_INCIDENT_TABLE_ROWS_COMPLETED;
        break;

      default:
        break;
    }
  },
  {
    incidentTableColumns: getIncidentTableColumns(defaultColumnNames),
    displayIncidentTableSettings: false,
    allSelected: false,
    selectedCount: 0,
    selectedRows: [],
    status: null,
    fetchingData: false,
    error: null,
  },
);

export default incidentTableSettings;
