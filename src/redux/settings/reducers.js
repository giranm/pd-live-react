import produce from 'immer';

import {
  TOGGLE_SETTINGS_REQUESTED,
  TOGGLE_SETTINGS_COMPLETED,
  SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED,
  SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED,
  SET_ALERT_CUSTOM_DETAIL_COLUMNS_REQUESTED,
  SET_ALERT_CUSTOM_DETAIL_COLUMNS_COMPLETED,
  CLEAR_LOCAL_CACHE_REQUESTED,
  CLEAR_LOCAL_CACHE_COMPLETED,
} from './actions';

const settings = produce(
  (draft, action) => {
    switch (action.type) {
      case TOGGLE_SETTINGS_REQUESTED:
        draft.status = TOGGLE_SETTINGS_REQUESTED;
        break;

      case TOGGLE_SETTINGS_COMPLETED:
        draft.displaySettingsModal = action.displaySettingsModal;
        draft.status = TOGGLE_SETTINGS_COMPLETED;
        break;

      case SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED:
        draft.status = SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED;
        break;

      case SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED:
        draft.defaultSinceDateTenor = action.defaultSinceDateTenor;
        draft.status = SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED;
        break;

      case SET_ALERT_CUSTOM_DETAIL_COLUMNS_REQUESTED:
        draft.status = SET_ALERT_CUSTOM_DETAIL_COLUMNS_REQUESTED;
        break;

      case SET_ALERT_CUSTOM_DETAIL_COLUMNS_COMPLETED:
        draft.alertCustomDetailFields = action.alertCustomDetailFields;
        draft.status = SET_ALERT_CUSTOM_DETAIL_COLUMNS_COMPLETED;
        break;

      case CLEAR_LOCAL_CACHE_REQUESTED:
        draft.status = CLEAR_LOCAL_CACHE_REQUESTED;
        break;

      case CLEAR_LOCAL_CACHE_COMPLETED:
        draft.status = CLEAR_LOCAL_CACHE_COMPLETED;
        break;

      default:
        break;
    }
  },
  {
    displaySettingsModal: false,
    defaultSinceDateTenor: '1 Day',
    alertCustomDetailFields: [
      { label: 'Environment:details.env', value: 'Environment:details.env', columnType: 'alert' },
    ],
    status: '',
  },
);

export default settings;
