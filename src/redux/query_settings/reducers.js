import produce from "immer";

import {
  TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED,
  TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED
} from "./actions";

const querySettings = produce(
  (draft, action) => {
    switch (action.type) {
      case TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED:
        draft.status = TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED;
        break;

      case TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED:
        draft.displayQuerySettings = action.displayQuerySettings;
        draft.status = TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED;
        break;

      default:
        break;
    }
  },
  {
    displayQuerySettings: true,
    status: null,
    fetchingData: false,
    error: null
  }
);

export default querySettings;