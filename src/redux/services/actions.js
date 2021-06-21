// Define Action Types
export const FETCH_SERVICES_REQUESTED = "FETCH_SERVICES_REQUESTED";
export const FETCH_SERVICES_COMPLETED = "FETCH_SERVICES_COMPLETED";
export const FETCH_SERVICES_ERROR = "FETCH_SERVICES_ERROR";

// Define Actions
export const getServicesAsync = (teamIds = []) => ({
  type: FETCH_SERVICES_REQUESTED,
  teamIds
});