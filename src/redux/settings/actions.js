// Define Action Types
export const TOGGLE_SETTINGS_REQUESTED = 'TOGGLE_SETTINGS_REQUESTED';
export const TOGGLE_SETTINGS_COMPLETED = 'TOGGLE_SETTINGS_COMPLETED';

// Define Actions
export const toggleSettingsModal = () => ({
  type: TOGGLE_SETTINGS_REQUESTED,
});
