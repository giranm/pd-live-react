import produce from "immer";

import {
  ACKNOWLEDGE_REQUESTED,
  ACKNOWLEDGE_COMPLETED,
  ACKNOWLEDGE_ERROR,
  SNOOZE_REQUESTED,
  SNOOZE_COMPLETED,
  SNOOZE_ERROR,
  RESOLVE_REQUESTED,
  RESOLVE_COMPLETED,
  RESOLVE_ERROR,
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

      case SNOOZE_REQUESTED:
        draft.status = SNOOZE_REQUESTED;
        break;

      case SNOOZE_COMPLETED:
        draft.snoozedIncidents = action.snoozedIncidents;
        draft.status = SNOOZE_COMPLETED;
        break;

      case SNOOZE_ERROR:
        draft.status = SNOOZE_ERROR;
        draft.error = action.message
        break;

      case RESOLVE_REQUESTED:
        draft.status = RESOLVE_REQUESTED;
        break;

      case RESOLVE_COMPLETED:
        draft.resolvedIncidents = action.resolvedIncidents;
        draft.status = RESOLVE_COMPLETED;
        break;

      case RESOLVE_ERROR:
        draft.status = RESOLVE_ERROR;
        draft.error = action.message
        break;

      default:
        break;
    }
  },
  {
    acknowledgedIncidents: [],
    snoozedIncidents: [],
    resolvedIncidents: [],
    status: null,
    fetchingData: false,
    error: null
  }
);

export default incidentActions;