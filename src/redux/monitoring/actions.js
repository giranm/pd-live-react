// Define Action Types
export const START_MONITORING_REQUESTED = 'START_MONITORING_REQUESTED';
export const START_MONITORING_COMPLETED = 'START_MONITORING_COMPLETED';
export const START_MONITORING_ERROR = 'START_MONITORING_ERROR';

export const STOP_MONITORING_REQUESTED = 'STOP_MONITORING_REQUESTED';
export const STOP_MONITORING_COMPLETED = 'STOP_MONITORING_COMPLETED';
export const STOP_MONITORING_ERROR = 'STOP_MONITORING_ERROR';

// Define Actions
export const startMonitoring = () => ({
  type: START_MONITORING_REQUESTED,
});

export const stopMonitoring = () => ({
  type: STOP_MONITORING_REQUESTED,
});
