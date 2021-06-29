import produce from "immer";

import {
  ACKNOWLEDGE_REQUESTED,
  ACKNOWLEDGE_COMPLETED,
  ACKNOWLEDGE_ERROR,
} from "./actions";

const incidentActions = produce(
  (draft, action) => {
    switch (action.type) {
      case ACKNOWLEDGE_REQUESTED:
        draft.status = ACKNOWLEDGE_REQUESTED;
        break;

      case ACKNOWLEDGE_COMPLETED:
        draft.acknowledgedIncidents = action.acknowledgedIncidents;
        draft.status = ACKNOWLEDGE_COMPLETED;
        break;

      case ACKNOWLEDGE_ERROR:
        draft.status = ACKNOWLEDGE_ERROR;
        draft.error = action.message
        break;

      default:
        break;
    }
  },
  {
    acknowledgedIncidents: [],
    status: null,
    fetchingData: false,
    error: null
  }
);

export default incidentActions;