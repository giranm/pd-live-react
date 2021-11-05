// Define Action Types
export const TOGGLE_SETTINGS_REQUESTED = 'TOGGLE_SETTINGS_REQUESTED';
export const TOGGLE_SETTINGS_COMPLETED = 'TOGGLE_SETTINGS_COMPLETED';

export const CLEAR_LOCAL_CACHE_REQUESTED = 'CLEAR_LOCAL_CACHE_REQUESTED';
export const CLEAR_LOCAL_CACHE_COMPLETED = 'CLEAR_LOCAL_CACHE_COMPLETED';

// Define Actions
export const toggleSettingsModal = () => ({
  type: TOGGLE_SETTINGS_REQUESTED,
});

export const clearLocalCache = () => ({
  type: CLEAR_LOCAL_CACHE_REQUESTED,
});
