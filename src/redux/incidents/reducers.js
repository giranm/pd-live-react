import produce from "immer";

import {
  FETCH_INCIDENTS_REQUESTED,
  FETCH_INCIDENTS_COMPLETED,
  FETCH_INCIDENTS_ERROR,
  UPDATE_INCIDENTS_LIST,
  UPDATE_INCIDENTS_LIST_COMPLETED,
  UPDATE_INCIDENTS_LIST_ERROR,
  FILTER_INCIDENTS_LIST_BY_PRIORITY,
  FILTER_INCIDENTS_LIST_BY_PRIORITY_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_PRIORITY_ERROR,
  FILTER_INCIDENTS_LIST_BY_STATUS,
  FILTER_INCIDENTS_LIST_BY_STATUS_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_STATUS_ERROR,
} from "./actions";

const incidents = produce(
  (draft, action) => {
    switch (action.type) {
      case FETCH_INCIDENTS_REQUESTED:
        draft.fetchingData = true;
        draft.status = FETCH_INCIDENTS_REQUESTED;
        break;

      case FETCH_INCIDENTS_COMPLETED:
        draft.fetchingData = false;
        draft.status = FETCH_INCIDENTS_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case FETCH_INCIDENTS_ERROR:
        draft.fetchingData = false;
        draft.status = FETCH_INCIDENTS_ERROR;
        draft.error = action.message
        break;

      case UPDATE_INCIDENTS_LIST:
        draft.fetchingData = false;
        draft.status = UPDATE_INCIDENTS_LIST;
        break;

      case UPDATE_INCIDENTS_LIST_COMPLETED:
        draft.fetchingData = false;
        draft.status = UPDATE_INCIDENTS_LIST_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case UPDATE_INCIDENTS_LIST_ERROR:
        draft.fetchingData = false;
        draft.status = UPDATE_INCIDENTS_LIST_ERROR;
        draft.error = action.message
        break;

      case FILTER_INCIDENTS_LIST_BY_PRIORITY:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_PRIORITY;
        break;

      case FILTER_INCIDENTS_LIST_BY_PRIORITY_COMPLETED:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_PRIORITY_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case FILTER_INCIDENTS_LIST_BY_PRIORITY_ERROR:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_PRIORITY_ERROR;
        draft.error = action.message
        break;

      case FILTER_INCIDENTS_LIST_BY_STATUS:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_STATUS;
        break;

      case FILTER_INCIDENTS_LIST_BY_STATUS_COMPLETED:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_STATUS_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case FILTER_INCIDENTS_LIST_BY_STATUS_ERROR:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_STATUS_ERROR;
        draft.error = action.message
        break;

      default:
        break;
    }
  },
  {
    incidents: [],
    status: null,
    fetchingData: false,
    error: null
  }
);

export default incidents;