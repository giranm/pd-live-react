// Define Action Types
export const ACKNOWLEDGE_REQUESTED = "ACKNOWLEDGE_REQUESTED";
export const ACKNOWLEDGE_COMPLETED = "ACKNOWLEDGE_COMPLETED";
export const ACKNOWLEDGE_ERROR = "ACKNOWLEDGE_ERROR";

export const RESOLVE_REQUESTED = "RESOLVE_REQUESTED";
export const RESOLVE_COMPLETED = "RESOLVE_COMPLETED";
export const RESOLVE_ERROR = "RESOLVE_ERROR";

export const acknowledge = (incidents) => ({
  type: ACKNOWLEDGE_REQUESTED,
  incidents
});

export const resolve = (incidents) => ({
  type: RESOLVE_REQUESTED,
  incidents
});