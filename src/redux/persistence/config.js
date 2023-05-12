import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

export const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    'actionAlertsModalData',
    'incidents',
    'logEntries',
    'querySettings',
    'incidentActions',
    'incidentDetails',
    'services',
    'teams',
    'users',
    'escalationPolicies',
    'extensions',
    'responsePlays',
    'persistence',
    'connection',
  ],
};

export const querySettingsPersistConfig = {
  key: 'querySettings',
  storage,
  blacklist: ['sinceDate', 'displayConfirmQueryModal', 'totalIncidentsFromQuery', 'error'],
};

export const userPersistConfig = {
  key: 'users',
  storage,
  blacklist: ['users', 'usersMap', 'currentUser'],
};
