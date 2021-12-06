/* eslint-disable no-useless-escape */
// Hosts App Constants
export const env = { ...process.env, ...window.env };

export const PD_OAUTH_CLIENT_ID = env.REACT_APP_PD_OAUTH_CLIENT_ID || 'ff64498e-4239-424e-b01b-9a9ecf842687';
export const PD_OAUTH_CLIENT_SECRET = env.REACT_APP_PD_OAUTH_CLIENT_SECRET || '6IUe6uHIaS3Lc_pwPQTsxyU2Wx4pHStvfI8-NLmK3P0';
export const LOG_ENTRIES_POLLING_INTERVAL_SECONDS = 5;
export const LOG_ENTRIES_CLEARING_INTERVAL_SECONDS = 30;
export const INCIDENTS_PAGINATION_LIMIT = 100;
export const DATE_FORMAT = 'DD-MMM \\at h:mm:ss A';
