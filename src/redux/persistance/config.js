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
    'services',
    'teams',
    'users',
    'escalationPolicies',
    'extensions',
    'responsePlays',
    'persistance',
  ],
};

export const querySettingsPersistConfig = {
  key: 'querySettings',
  storage,
  blacklist: ['sinceDate', 'untilDate'],
};
