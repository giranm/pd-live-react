// Define Action Types
export const FETCH_TEAMS_REQUESTED = "FETCH_TEAMS_REQUESTED";
export const FETCH_TEAMS_COMPLETED = "FETCH_TEAMS_COMPLETED";
export const FETCH_TEAMS_ERROR = "FETCH_TEAMS_ERROR";

// Define Actions
export const getTeamsAsync = () => ({
  type: FETCH_TEAMS_REQUESTED
});