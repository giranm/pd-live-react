import produce from "immer";

import {
  ACKNOWLEDGE_REQUESTED,
  ACKNOWLEDGE_COMPLETED,
  ACKNOWLEDGE_ERROR,
  ESCALATE_REQUESTED,
  ESCALATE_COMPLETED,
  ESCALATE_ERROR,
  SNOOZE_REQUESTED,
  SNOOZE_COMPLETED,
  SNOOZE_ERROR,
  TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_REQUESTED,
  TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_COMPLETED,
  RESOLVE_REQUESTED,
  RESOLVE_COMPLETED,
  RESOLVE_ERROR,
  UPDATE_PRIORITY_REQUESTED,
  UPDATE_PRIORITY_COMPLETED,
  UPDATE_PRIORITY_ERROR,
  ADD_NOTE_REQUESTED,
  ADD_NOTE_COMPLETED,
  ADD_NOTE_ERROR,
  TOGGLE_DISPLAY_ADD_NOTE_MODAL_REQUESTED,
  TOGGLE_DISPLAY_ADD_NOTE_MODAL_COMPLETED,
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

      case ESCALATE_REQUESTED:
        draft.status = ESCALATE_REQUESTED;
        break;

      case ESCALATE_COMPLETED:
        draft.escalatedIncidents = action.escalatedIncidents;
        draft.status = ESCALATE_COMPLETED;
        break;

      case ESCALATE_ERROR:
        draft.status = ESCALATE_ERROR;
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

      case TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_REQUESTED:
        draft.status = TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_REQUESTED;
        break;

      case TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_COMPLETED:
        draft.displayCustomSnoozeModal = action.displayCustomSnoozeModal;
        draft.status = TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_COMPLETED;
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

      case UPDATE_PRIORITY_REQUESTED:
        draft.status = UPDATE_PRIORITY_REQUESTED;
        break;

      case UPDATE_PRIORITY_COMPLETED:
        draft.updatedIncidentPriorities = action.updatedIncidentPriorities;
        draft.status = UPDATE_PRIORITY_COMPLETED;
        break;

      case UPDATE_PRIORITY_ERROR:
        draft.status = UPDATE_PRIORITY_ERROR;
        draft.error = action.message
        break;

      case ADD_NOTE_REQUESTED:
        draft.status = ADD_NOTE_REQUESTED;
        break;

      case ADD_NOTE_COMPLETED:
        draft.updatedIncidentNotes = action.updatedIncidentNotes;
        draft.status = ADD_NOTE_COMPLETED;
        break;

      case ADD_NOTE_ERROR:
        draft.status = ADD_NOTE_ERROR;
        draft.error = action.message
        break;

      case TOGGLE_DISPLAY_ADD_NOTE_MODAL_REQUESTED:
        draft.status = TOGGLE_DISPLAY_ADD_NOTE_MODAL_REQUESTED;
        break;

      case TOGGLE_DISPLAY_ADD_NOTE_MODAL_COMPLETED:
        draft.displayAddNoteModal = action.displayAddNoteModal;
        draft.status = TOGGLE_DISPLAY_ADD_NOTE_MODAL_COMPLETED;
        break;

      default:
        break;
    }
  },
  {
    acknowledgedIncidents: [],
    escalatedIncidents: [],
    snoozedIncidents: [],
    resolvedIncidents: [],
    updatedIncidentNotes: [],
    updatedIncidentPriorities: [],
    displayCustomSnoozeModal: false,
    displayAddNoteModal: false,
    status: null,
    fetchingData: false,
    error: null
  }
);

export default incidentActions;