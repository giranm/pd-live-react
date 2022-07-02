/* eslint-disable max-len */
// Define Action Types
export const TOGGLE_SETTINGS_REQUESTED = 'TOGGLE_SETTINGS_REQUESTED';
export const TOGGLE_SETTINGS_COMPLETED = 'TOGGLE_SETTINGS_COMPLETED';

export const SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED = 'SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED';
export const SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED = 'SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED';

export const SET_ALERT_CUSTOM_DETAIL_COLUMNS_REQUESTED = 'SET_ALERT_CUSTOM_DETAIL_COLUMNS_REQUESTED';
export const SET_ALERT_CUSTOM_DETAIL_COLUMNS_COMPLETED = 'SET_ALERT_CUSTOM_DETAIL_COLUMNS_COMPLETED';

export const CLEAR_LOCAL_CACHE_REQUESTED = 'CLEAR_LOCAL_CACHE_REQUESTED';
export const CLEAR_LOCAL_CACHE_COMPLETED = 'CLEAR_LOCAL_CACHE_COMPLETED';

// Define Actions
export const toggleSettingsModal = () => ({
  type: TOGGLE_SETTINGS_REQUESTED,
});

export const setDefaultSinceDateTenor = (defaultSinceDateTenor) => ({
  type: SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED,
  defaultSinceDateTenor,
});

export const setAlertCustomDetailColumns = (customDetailFields) => ({
  type: SET_ALERT_CUSTOM_DETAIL_COLUMNS_REQUESTED,
  customDetailFields,
});

export const clearLocalCache = () => ({
  type: CLEAR_LOCAL_CACHE_REQUESTED,
});
