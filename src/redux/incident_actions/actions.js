// Define Action Types
export const ACKNOWLEDGE_REQUESTED = "ACKNOWLEDGE_REQUESTED";
export const ACKNOWLEDGE_COMPLETED = "ACKNOWLEDGE_COMPLETED";
export const ACKNOWLEDGE_ERROR = "ACKNOWLEDGE_ERROR";

export const acknowledge = (incidents) => ({
  type: ACKNOWLEDGE_REQUESTED,
  incidents
});