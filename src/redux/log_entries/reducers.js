import produce from "immer";

import {
  FETCH_LOG_ENTRIES_REQUESTED,
  FETCH_LOG_ENTRIES_COMPLETED,
  FETCH_LOG_ENTRIES_ERROR,
  UPDATE_RECENT_LOG_ENTRIES,
  UPDATE_RECENT_LOG_ENTRIES_COMPLETED,
  UPDATE_RECENT_LOG_ENTRIES_ERROR
} from "./actions";

const logEntries = produce(
  (draft, action) => {
    switch (action.type) {
      case FETCH_LOG_ENTRIES_REQUESTED:
        draft.fetchingData = true;
        draft.status = FETCH_LOG_ENTRIES_REQUESTED;
        break;

      case FETCH_LOG_ENTRIES_COMPLETED:
        draft.fetchingData = false;
        draft.status = FETCH_LOG_ENTRIES_COMPLETED;
        draft.logEntries = action.logEntries;
        break;

      case FETCH_LOG_ENTRIES_ERROR:
        draft.fetchingData = false;
        draft.status = FETCH_LOG_ENTRIES_ERROR;
        draft.error = action.message
        break;

      case UPDATE_RECENT_LOG_ENTRIES:
        draft.fetchingData = false;
        draft.status = UPDATE_RECENT_LOG_ENTRIES;
        break;

      case UPDATE_RECENT_LOG_ENTRIES_COMPLETED:
        draft.fetchingData = false;
        draft.status = UPDATE_RECENT_LOG_ENTRIES_COMPLETED;
        draft.recentLogEntries = action.recentLogEntries;
        break;

      case UPDATE_RECENT_LOG_ENTRIES_ERROR:
        draft.fetchingData = false;
        draft.status = UPDATE_RECENT_LOG_ENTRIES_ERROR;
        draft.error = action.message
        break;

      default:
        break;
    }
  },
  {
    logEntries: [],
    recentLogEntries: [],
    status: null,
    fetchingData: false,
    error: null
  }
);

export default logEntries;