import produce from 'immer';

import {
  TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_REQUESTED,
  TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_COMPLETED,
  UPDATE_INCIDENT_DETAILS_MODAL_REQUESTED,
  UPDATE_INCIDENT_DETAILS_MODAL_COMPLETED,
} from './actions';

const incidentDetails = produce(
  (draft, action) => {
    switch (action.type) {
      case TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_REQUESTED:
        draft.status = TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_REQUESTED;
        break;

      case TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_COMPLETED:
        draft.displayIncidentDetailsModal = action.displayIncidentDetailsModal;
        draft.status = TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_COMPLETED;
        break;

      case UPDATE_INCIDENT_DETAILS_MODAL_REQUESTED:
        draft.status = UPDATE_INCIDENT_DETAILS_MODAL_REQUESTED;
        break;

      case UPDATE_INCIDENT_DETAILS_MODAL_COMPLETED:
        draft.incident = action.incident;
        draft.status = UPDATE_INCIDENT_DETAILS_MODAL_COMPLETED;
        break;

      default:
        break;
    }
  },
  {
    displayIncidentDetailsModal: true,
    incident: null,
    status: null,
    fetchingData: false,
    error: null,
  },
);

export default incidentDetails;
