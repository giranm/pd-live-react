import produce from "immer";

import { FETCH_INCIDENTS_REQUESTED, FETCH_INCIDENTS_COMPLETED, FETCH_INCIDENTS_ERROR } from "./actions";

const incidents = produce(
  (draft, action) => {
    switch (action.type) {
      case FETCH_INCIDENTS_REQUESTED:
        draft.fetchingIncidents = true;
        break;
      case FETCH_INCIDENTS_COMPLETED:
        draft.fetchingIncidents = false;
        draft.incidents = action.incidents;
        break;
      case FETCH_INCIDENTS_ERROR:
        draft.fetchingIncidents = false;
        break;
      default:
        break;
    }
  },
  {
    incidents: []
  }
);

export default incidents;