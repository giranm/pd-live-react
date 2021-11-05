/* eslint-disable no-useless-escape */
// Hosts App Constants
export const PD_OAUTH_CLIENT_ID = (() => {
  const clientIdLocalHost = 'b0770bc5-8649-4f60-9b16-1ba9360e2a82';
  const clientIdRemoteHost = '1f6dc4e813e1a3da7a99871cea7429f5413db48f6e052e6d2e5998f8a545139c';
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return clientIdLocalHost;
  }
  return clientIdRemoteHost;
})();
export const LOG_ENTRIES_POLLING_INTERVAL_SECONDS = 5;
export const LOG_ENTRIES_CLEARING_INTERVAL_SECONDS = 30;
export const INCIDENTS_PAGINATION_LIMIT = 100;
export const DATE_FORMAT = 'DD-MMM \\at h:mm:ss A';
