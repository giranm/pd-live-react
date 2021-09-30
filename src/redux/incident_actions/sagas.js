/* eslint-disable array-callback-return */
import { put, call, select, takeLatest, all } from "redux-saga/effects";
import { api } from '@pagerduty/pdjs';

import {
  ACKNOWLEDGE_REQUESTED,
  ACKNOWLEDGE_COMPLETED,
  ACKNOWLEDGE_ERROR,
  ESCALATE_REQUESTED,
  ESCALATE_COMPLETED,
  ESCALATE_ERROR,
  REASSIGN_REQUESTED,
  REASSIGN_COMPLETED,
  REASSIGN_ERROR,
  TOGGLE_DISPLAY_REASSIGN_MODAL_REQUESTED,
  TOGGLE_DISPLAY_REASSIGN_MODAL_COMPLETED,
  ADD_RESPONDER_REQUESTED,
  ADD_RESPONDER_COMPLETED,
  ADD_RESPONDER_ERROR,
  TOGGLE_DISPLAY_ADD_RESPONDER_MODAL_REQUESTED,
  TOGGLE_DISPLAY_ADD_RESPONDER_MODAL_COMPLETED,
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

import {
  TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED,
  UPDATE_ACTION_ALERTS_MODAL_REQUESTED,
} from "redux/action_alerts/actions";

import { selectIncidentActions } from "./selectors";
import { selectPriorities } from "redux/priorities/selectors";

import {
  TRIGGERED,
  ACKNOWLEDGED,
  RESOLVED,
  SNOOZED,
  SNOOZE_TIMES,
  filterIncidentsByField,
  generateIncidentActionModal
} from "util/incidents";

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

// Helper function to display modal with API result
export function* displayActionModal(actionAlertsModalType, actionAlertsModalMessage) {
  yield put({ type: UPDATE_ACTION_ALERTS_MODAL_REQUESTED, actionAlertsModalType, actionAlertsModalMessage });
  yield put({ type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED });
};

// Helper function to handle API errors in response
const handleSingleAPIErrorResponse = (response) => {
  if (response.data.error) {
    throw Error(response.data.error.message);
  } else {
    throw Error("Unknown error while using PD API");
  };
};

const handleMultipleAPIErrorResponses = (responses) => {
  let errors = responses
    .filter((response) => response.data.error)
    .map((response) => response.data.error.message);
  if (errors.length) {
    throw Error(errors);
  } else {
    throw Error("Unknown error while using PD API");
  };
}

// Helper function to handle errors while processing saga
export function* handleSagaError(action, exception) {
  yield displayActionModal("danger", exception.message)
  yield put({ type: action, message: exception.message });
}

export function* acknowledgeAsync() {
  yield takeLatest(ACKNOWLEDGE_REQUESTED, acknowledge);
};

export function* acknowledge(action) {
  try {
    let { incidents, displayModal } = action;
    let incidentsToBeAcknowledged = filterIncidentsByField(incidents, "status", [TRIGGERED, ACKNOWLEDGED]);

    // Build request manually given PUT
    let data = {
      "incidents": incidentsToBeAcknowledged.map(incident => {
        return {
          "id": incident.id,
          "type": "incident_reference",
          "status": ACKNOWLEDGED
        };
      })
    };

    let response = yield call(pd, {
      method: "put",
      endpoint: "incidents",
      data
    });

    if (response.ok) {
      yield put({
        type: ACKNOWLEDGE_COMPLETED,
        acknowledgedIncidents: response.resource
      });
      if (displayModal) {
        let {
          actionAlertsModalType,
          actionAlertsModalMessage
        } = generateIncidentActionModal(incidents, ACKNOWLEDGED);
        yield displayActionModal(actionAlertsModalType, actionAlertsModalMessage);
      };
    } else {
      handleSingleAPIErrorResponse(response);
    }

  } catch (e) {
    handleSagaError(ACKNOWLEDGE_ERROR, e);
  }
};

export function* escalateAsync() {
  yield takeLatest(ESCALATE_REQUESTED, escalate);
};

export function* escalate(action) {
  try {
    let { incidents: selectedIncidents, escalationLevel, displayModal } = action;

    // Build request manually given PUT
    let data = {
      "incidents": selectedIncidents.map(incident => {
        return {
          "id": incident.id,
          "type": "incident_reference",
          "escalation_level": escalationLevel
        };
      })
    };

    let response = yield call(pd, {
      method: "put",
      endpoint: "incidents",
      data
    });

    if (response.ok) {
      yield put({
        type: ESCALATE_COMPLETED,
        escalatedIncidents: response.resource
      });
      if (displayModal) {
        let actionAlertsModalType = "success"
        let actionAlertsModalMessage = `Incident(s) ${selectedIncidents
          .map(i => i.incident_number)
          .join(", ")} have been manually escalated to level ${escalationLevel}`;
        yield displayActionModal(actionAlertsModalType, actionAlertsModalMessage);
      };
    } else {
      handleSingleAPIErrorResponse(response);
    }

  } catch (e) {
    handleSagaError(ESCALATE_ERROR, e);
  }
};

export function* reassignAsync() {
  yield takeLatest(REASSIGN_REQUESTED, reassign);
};

export function* reassign(action) {
  try {
    let { incidents: selectedIncidents, assignment, displayModal } = action;

    // Build request manually given PUT
    let data = {
      "incidents": selectedIncidents.map(incident => {
        let updatedIncident = {
          "id": incident.id,
          "type": "incident_reference",
        };
        // Determine if EP or User Assignment
        if (assignment.type === "escalation_policy") {
          updatedIncident["escalation_policy"] = {
            "id": assignment.value,
            "type": "escalation_policy"
          }
        } else if (assignment.type === "user") {
          updatedIncident["assignments"] = [
            {
              "assignee": {
                "id": assignment.value,
                "type": "user"
              }
            }
          ]
        }
        return updatedIncident;
      })
    };

    let response = yield call(pd, {
      method: "put",
      endpoint: "incidents",
      data
    });

    if (response.ok) {
      yield put({
        type: REASSIGN_COMPLETED,
        escalatedIncidents: response.resource
      });
      yield toggleDisplayReassignModalImpl();
      if (displayModal) {
        let actionAlertsModalType = "success"
        let actionAlertsModalMessage = `Incident(s) ${selectedIncidents
          .map(i => i.incident_number)
          .join(", ")} have been reassigned to ${assignment.name}`;
        yield displayActionModal(actionAlertsModalType, actionAlertsModalMessage);
      };
    } else {
      handleSingleAPIErrorResponse(response);
    }

  } catch (e) {
    handleSagaError(REASSIGN_ERROR, e);
  }
};

export function* toggleDisplayReassignModal() {
  yield takeLatest(TOGGLE_DISPLAY_REASSIGN_MODAL_REQUESTED, toggleDisplayReassignModalImpl);
};

export function* toggleDisplayReassignModalImpl() {
  let { displayReassignModal } = yield select(selectIncidentActions);
  yield put({ type: TOGGLE_DISPLAY_REASSIGN_MODAL_COMPLETED, displayReassignModal: !displayReassignModal });
};

export function* addResponderAsync() {
  yield takeLatest(ADD_RESPONDER_REQUESTED, addResponder);
};

export function* addResponder(action) {
  try {
    let { incidents: selectedIncidents, responderRequestTargets, message, displayModal } = action;

    // Build individual requests as the endpoint supports singular POST
    let addResponderRequests = selectedIncidents.map(incident => {
      return call(pd, {
        method: "post",
        endpoint: `incidents/${incident.id}/responder_requests`,
        data: {
          message,
          responder_request_targets: responderRequestTargets.map(target => {
            return {
              "responder_request_target": {
                "id": target.value,
                "summary": target.name,
                "type": target.type
              }
            }
          })
        }
      });
    });

    // Invoke parallel calls for optimal performance
    let responses = yield all(addResponderRequests);
    if (responses.every((response) => response.ok)) {
      yield put({
        type: ADD_RESPONDER_COMPLETED,
        updatedIncidentResponderRequests: responses
      });
      yield toggleDisplayAddResponderModalImpl();
      if (displayModal) {
        let actionAlertsModalType = "success"
        let actionAlertsModalMessage = `Requested additional response for incident(s) ${selectedIncidents
          .map(i => i.incident_number)
          .join(", ")}.`;
        yield displayActionModal(actionAlertsModalType, actionAlertsModalMessage);
      };
    } else {
      handleMultipleAPIErrorResponses(responses);
    };

  } catch (e) {
    handleSagaError(ADD_RESPONDER_ERROR, e);
  }
};

export function* toggleDisplayAddResponderModal() {
  yield takeLatest(TOGGLE_DISPLAY_ADD_RESPONDER_MODAL_REQUESTED, toggleDisplayAddResponderModalImpl);
};

export function* toggleDisplayAddResponderModalImpl() {
  let { displayAddResponderModal } = yield select(selectIncidentActions);
  yield put({ type: TOGGLE_DISPLAY_ADD_RESPONDER_MODAL_COMPLETED, displayAddResponderModal: !displayAddResponderModal });
};

export function* snoozeAsync() {
  yield takeLatest(SNOOZE_REQUESTED, snooze);
};

export function* snooze(action) {
  try {
    let { incidents, duration, displayModal } = action;
    let incidentsToBeSnoozed = filterIncidentsByField(incidents, "status", [TRIGGERED, ACKNOWLEDGED]);

    // In order to snooze, triggered incidents must be acknowledged first; modal will be hidden.
    yield put({ type: ACKNOWLEDGE_REQUESTED, incidents, displayModal: false });

    // Build individual requests as the endpoint supports singular POST
    let snoozeRequests = incidentsToBeSnoozed.map(incident => {
      return call(pd, {
        method: "post",
        endpoint: `incidents/${incident.id}/snooze`,
        data: {
          // Handle pre-built snoozes as well as custom durations
          duration: SNOOZE_TIMES[duration] ? SNOOZE_TIMES[duration] : duration
        }
      });
    });

    // Invoke parallel calls for optimal performance
    let responses = yield all(snoozeRequests);
    if (responses.every((response) => response.ok)) {
      yield put({
        type: SNOOZE_COMPLETED,
        snoozedIncidents: responses
      });
      if (displayModal) {
        let {
          actionAlertsModalType,
          actionAlertsModalMessage
        } = generateIncidentActionModal(incidents, SNOOZED);
        yield displayActionModal(actionAlertsModalType, actionAlertsModalMessage);
      };
    } else {
      handleMultipleAPIErrorResponses(responses);
    };

  } catch (e) {
    handleSagaError(SNOOZE_ERROR, e);
  }
};

export function* toggleDisplayCustomSnoozeModal() {
  yield takeLatest(TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_REQUESTED, toggleDisplayCustomSnoozeModalImpl);
};

export function* toggleDisplayCustomSnoozeModalImpl() {
  let { displayCustomSnoozeModal } = yield select(selectIncidentActions);
  yield put({ type: TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_COMPLETED, displayCustomSnoozeModal: !displayCustomSnoozeModal });
};

export function* resolveAsync() {
  yield takeLatest(RESOLVE_REQUESTED, resolve);
};

export function* resolve(action) {
  try {
    let { incidents, displayModal } = action;
    let incidentsToBeResolved = filterIncidentsByField(incidents, "status", [TRIGGERED, ACKNOWLEDGED]);

    // Build request manually given PUT
    let data = {
      "incidents": incidentsToBeResolved.map(incident => {
        return {
          "id": incident.id,
          "type": "incident_reference",
          "status": RESOLVED
        };
      })
    };

    let response = yield call(pd, {
      method: "put",
      endpoint: "incidents",
      data
    });

    if (response.ok) {
      yield put({
        type: RESOLVE_COMPLETED,
        resolvedIncidents: response.resource
      });
      if (displayModal) {
        let {
          actionAlertsModalType,
          actionAlertsModalMessage
        } = generateIncidentActionModal(incidents, RESOLVED);
        yield displayActionModal(actionAlertsModalType, actionAlertsModalMessage);
      };
    } else {
      handleSingleAPIErrorResponse(response);
    };

  } catch (e) {
    handleSagaError(RESOLVE_ERROR, e);
  }
};

export function* updatePriorityAsync() {
  yield takeLatest(UPDATE_PRIORITY_REQUESTED, updatePriority);
};

export function* updatePriority(action) {
  try {
    let { incidents: selectedIncidents, priorityId, displayModal } = action;
    let { priorities } = yield select(selectPriorities);
    let priorityName = priorities.filter(p => p.id === priorityId)[0].name;

    // Build priority data object - handle unset priority
    let priorityData = {};
    if (priorityName === "--") {
      priorityData = null;
    } else {
      priorityData = {
        "id": priorityId,
        "type": "priority_reference"
      }
    }

    // Build individual requests as the endpoint supports singular PUT
    let updatePriorityRequests = selectedIncidents.map(incident => {
      return call(pd, {
        method: "put",
        endpoint: `incidents/${incident.id}`,
        data: {
          "incident": {
            "type": "incident",
            "priority": priorityData
          }
        }
      });
    });

    // Invoke parallel calls for optimal performance
    let responses = yield all(updatePriorityRequests);
    if (responses.every((response) => response.ok)) {
      yield put({
        type: UPDATE_PRIORITY_COMPLETED,
        updatedIncidentPriorities: responses
      });
      if (displayModal) {
        let actionAlertsModalType = "success"
        let actionAlertsModalMessage = `Incident(s) ${selectedIncidents
          .map(i => i.incident_number)
          .join(", ")} have been updated with priority = ${priorityName}`;
        yield displayActionModal(actionAlertsModalType, actionAlertsModalMessage);
      };
    } else {
      handleMultipleAPIErrorResponses(responses);
    };

  } catch (e) {
    handleSagaError(UPDATE_PRIORITY_ERROR, e);
  }
};

export function* addNoteAsync() {
  yield takeLatest(ADD_NOTE_REQUESTED, addNote);
};

export function* addNote(action) {
  try {
    let { incidents: selectedIncidents, note, displayModal } = action;

    // Build individual requests as the endpoint supports singular POST
    let addNoteRequests = selectedIncidents.map(incident => {
      return call(pd, {
        method: "post",
        endpoint: `incidents/${incident.id}/notes`,
        data: { note: { content: note } }
      });
    });

    // Invoke parallel calls for optimal performance
    let responses = yield all(addNoteRequests);
    if (responses.every((response) => response.ok)) {
      yield put({
        type: ADD_NOTE_COMPLETED,
        updatedIncidentNotes: responses
      });
      yield toggleDisplayAddNoteModalImpl();
      if (displayModal) {
        let actionAlertsModalType = "success"
        let actionAlertsModalMessage = `Incident(s) ${selectedIncidents
          .map(i => i.incident_number)
          .join(", ")} have been updated with a note.`;
        yield displayActionModal(actionAlertsModalType, actionAlertsModalMessage);
      };
    } else {
      handleMultipleAPIErrorResponses(responses);
    };

  } catch (e) {
    handleSagaError(ADD_NOTE_ERROR, e);
  }
};

export function* toggleDisplayAddNoteModal() {
  yield takeLatest(TOGGLE_DISPLAY_ADD_NOTE_MODAL_REQUESTED, toggleDisplayAddNoteModalImpl);
};

export function* toggleDisplayAddNoteModalImpl() {
  let { displayAddNoteModal } = yield select(selectIncidentActions);
  yield put({ type: TOGGLE_DISPLAY_ADD_NOTE_MODAL_COMPLETED, displayAddNoteModal: !displayAddNoteModal });
};