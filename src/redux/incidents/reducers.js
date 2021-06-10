import produce from "immer";

import { FETCH_INCIDENTS_REQUESTED, FETCH_INCIDENTS_COMPLETED, FETCH_INCIDENTS_ERROR } from "./actions";

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