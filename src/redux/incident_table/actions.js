// Define Action Types
export const UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED = "UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED";
export const UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED = "UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED";

// Define Actions
export const updateIncidentTableColumns = (incidentTableColumns) => ({
  type: UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED,
  incidentTableColumns
});