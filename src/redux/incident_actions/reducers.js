import produce from "immer";

import {
  ACKNOWLEDGE_INCIDENTS_REQUESTED,
  ACKNOWLEDGE_INCIDENTS_COMPLETED,
  ACKNOWLEDGE_INCIDENTS_ERROR,
} from "./actions";

const incidentActions = produce(
  (draft, action) => {
    switch (action.type) {
      case ACKNOWLEDGE_INCIDENTS_REQUESTED:
        draft.status = ACKNOWLEDGE_INCIDENTS_REQUESTED;
        break;

      case ACKNOWLEDGE_INCIDENTS_COMPLETED:
        draft.acknowledgedIncidents = action.acknowledgedIncidents;
        draft.status = ACKNOWLEDGE_INCIDENTS_COMPLETED;
        break;

      case ACKNOWLEDGE_INCIDENTS_ERROR:
        draft.status = ACKNOWLEDGE_INCIDENTS_ERROR;
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