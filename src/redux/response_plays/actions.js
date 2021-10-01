// Define Action Types
export const FETCH_RESPONSE_PLAYS_REQUESTED = "FETCH_RESPONSE_PLAYS_REQUESTED";
export const FETCH_RESPONSE_PLAYS_COMPLETED = "FETCH_RESPONSE_PLAYS_COMPLETED";
export const FETCH_RESPONSE_PLAYS_ERROR = "FETCH_RESPONSE_PLAYS_ERROR";

export const RUN_RESPONSE_PLAY_REQUESTED = "RUN_RESPONSE_PLAY_REQUESTED";
export const RUN_RESPONSE_PLAY_COMPLETED = "RUN_RESPONSE_PLAY_COMPLETED";
export const RUN_RESPONSE_PLAY_ERROR = "RUN_RESPONSE_PLAY_ERROR";

// Define Actions
export const getResponsePlaysAsync = () => ({
  type: FETCH_RESPONSE_PLAYS_REQUESTED
});

export const runResponsePlayAsync = (incidents, responsePlayId, displayModal = true) => ({
  type: RUN_RESPONSE_PLAY_REQUESTED,
  incidents,
  responsePlayId,
  displayModal
});