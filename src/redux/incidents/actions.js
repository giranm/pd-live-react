// Define Action Types
export const FETCH_INCIDENTS_REQUESTED = "FETCH_INCIDENTS_REQUESTED";
export const FETCH_INCIDENTS_COMPLETED = "FETCH_INCIDENTS_COMPLETED";
export const FETCH_INCIDENTS_ERROR = "FETCH_INCIDENTS_ERROR";

// Define Actions
export const getIncidentsAsync = (since, until) => ({
  type: FETCH_INCIDENTS_REQUESTED,
  since,
  until
});