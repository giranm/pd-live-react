// Define Action Types
export const UPDATE_CONNECTION_STATUS_REQUESTED = 'UPDATE_CONNECTION_STATUS_REQUESTED';
export const UPDATE_CONNECTION_STATUS_COMPLETED = 'UPDATE_CONNECTION_STATUS_COMPLETED';

// Define Actions
export const updateConnectionStatus = (connectionStatus, connectionStatusMessage) => ({
  type: UPDATE_CONNECTION_STATUS_REQUESTED,
  connectionStatus,
  connectionStatusMessage,
});
