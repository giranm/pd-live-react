// Define Action Types
export const UPDATE_CONNECTION_STATUS_REQUESTED = 'UPDATE_CONNECTION_STATUS_REQUESTED';
export const UPDATE_CONNECTION_STATUS_COMPLETED = 'UPDATE_CONNECTION_STATUS_COMPLETED';

export const CHECK_CONNECTION_STATUS_REQUESTED = 'CHECK_CONNECTION_STATUS_REQUESTED';
export const CHECK_CONNECTION_STATUS_COMPLETED = 'CHECK_CONNECTION_STATUS_COMPLETED';

export const CHECK_ABILITIES_REQUESTED = 'CHECK_ABILITIES_REQUESTED';
export const CHECK_ABILITIES_COMPLETED = 'CHECK_ABILITIES_COMPLETED';
export const CHECK_ABILITIES_ERROR = 'CHECK_ABILITIES_ERROR';

// Define Actions
export const updateConnectionStatus = (connectionStatus, connectionStatusMessage) => ({
  type: UPDATE_CONNECTION_STATUS_REQUESTED,
  connectionStatus,
  connectionStatusMessage,
});

export const checkConnectionStatus = () => ({
  type: CHECK_CONNECTION_STATUS_REQUESTED,
});

export const checkAbilities = () => ({
  type: CHECK_ABILITIES_REQUESTED,
});
