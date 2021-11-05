import produce from 'immer';

import {
  TOGGLE_SETTINGS_REQUESTED,
  TOGGLE_SETTINGS_COMPLETED,
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
    status: '',
  },
);

export default settings;
