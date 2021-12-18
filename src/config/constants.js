// Hosts App Constants
export const env = { ...process.env, ...window.env };

// Authentication
export const PD_OAUTH_CLIENT_ID = env.REACT_APP_PD_OAUTH_CLIENT_ID || null;
export const PD_OAUTH_CLIENT_SECRET = env.REACT_APP_PD_OAUTH_CLIENT_SECRET || null;
export const PD_SUBDOMAIN_ALLOW_LIST = env.REACT_APP_PD_SUBDOMAIN_ALLOW_LIST || '*';
export const PD_USER_TOKEN = env.REACT_APP_PD_USER_TOKEN || null;

// REST API
export const LOG_ENTRIES_POLLING_INTERVAL_SECONDS = 5;
export const LOG_ENTRIES_CLEARING_INTERVAL_SECONDS = 30;
export const INCIDENTS_PAGINATION_LIMIT = 100;

// Date formatting
export const DATE_FORMAT = 'DD-MMM \\at h:mm:ss A';
