import produce from "immer";

import {
  TOGGLE_INCIDENT_TABLE_SETTINGS_REQUESTED,
  TOGGLE_INCIDENT_TABLE_SETTINGS_COMPLETED,
  UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED,
  UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED,
} from "./actions";

import { getIncidentTableColumns } from "util/incident-table-columns";

const defaultColumnNames = [
  "#",
  "Status",
  "Priority",
  "Title",
  "Created At",
  "Service",
]

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

      case UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED:
        draft.status = UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED;
        break;

      case UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED:
        draft.incidentTableColumns = action.incidentTableColumns;
        draft.status = UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED;
        break;

      default:
        break;
    }
  },
  {
    incidentTableColumns: getIncidentTableColumns(defaultColumnNames),
    displayIncidentTableSettings: false,
    status: null,
    fetchingData: false,
    error: null
  }
);

export default incidentTableSettings;