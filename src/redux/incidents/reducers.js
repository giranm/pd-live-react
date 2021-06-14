import produce from "immer";

import {
  FETCH_INCIDENTS_REQUESTED,
  FETCH_INCIDENTS_COMPLETED,
  FETCH_INCIDENTS_ERROR,
  UPDATE_INCIDENTS_LIST,
  UPDATE_INCIDENTS_LIST_COMPLETED,
  UPDATE_INCIDENTS_LIST_ERROR
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