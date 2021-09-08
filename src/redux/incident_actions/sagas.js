/* eslint-disable array-callback-return */
import { put, call, select, takeLatest, all } from "redux-saga/effects";
import { api } from '@pagerduty/pdjs';

import {
  ACKNOWLEDGE_REQUESTED,
  ACKNOWLEDGE_COMPLETED,
  ACKNOWLEDGE_ERROR,
  SNOOZE_REQUESTED,
  SNOOZE_COMPLETED,
  SNOOZE_ERROR,
  TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_REQUESTED,
  TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_COMPLETED,
  RESOLVE_REQUESTED,
  RESOLVE_COMPLETED,
  RESOLVE_ERROR,
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
import { selectUsers } from "redux/users/selectors";

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

export function* acknowledgeAsync() {
  yield takeLatest(ACKNOWLEDGE_REQUESTED, acknowledge);
};

export function* acknowledge(action) {
  try {
    let { incidents, displayModal } = action;
    let { currentUser } = yield select(selectUsers);
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
      headers: { "From": currentUser["email"] },
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
      if (response.data.error) {
        throw Error(response.data.error.message);
      } else {
        throw Error("Unknown error while using PD API");
      };
    };

  } catch (e) {
    yield displayActionModal("danger", e.message)
    yield put({ type: ACKNOWLEDGE_ERROR, message: e.message });
  }
};

export function* snoozeAsync() {
  yield takeLatest(SNOOZE_REQUESTED, snooze);
};

export function* snooze(action) {
  try {
    let { incidents, duration, displayModal } = action;
    let { currentUser } = yield select(selectUsers);
    let incidentsToBeSnoozed = filterIncidentsByField(incidents, "status", [TRIGGERED, ACKNOWLEDGED]);

    // In order to snooze, triggered incidents must be acknowledged first; modal will be hidden.
    yield put({ type: ACKNOWLEDGE_REQUESTED, incidents, displayModal: false });

    // Build individual requests as the endpoint supports singular POST
    let snoozeRequests = incidentsToBeSnoozed.map(incident => {
      return call(pd, {
        method: "post",
        endpoint: `incidents/${incident.id}/snooze`,
        headers: { "From": currentUser["email"] },
        data: { duration: SNOOZE_TIMES[duration] }
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
      let errors = responses
        .filter((response) => response.data.error)
        .map((response) => response.data.error.message);
      if (errors.length) {
        throw Error(errors);
      } else {
        throw Error("Unknown error while using PD API");
      };
    };

  } catch (e) {
    yield displayActionModal("danger", e.message)
    yield put({ type: SNOOZE_ERROR, message: e.message });
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
    let { currentUser } = yield select(selectUsers);
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
      headers: { "From": currentUser["email"] },
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
      if (response.data.error) {
        throw Error(response.data.error.message);
      } else {
        throw Error("Unknown error while using PD API");
      };
    };

  } catch (e) {
    yield displayActionModal("danger", e.message)
    yield put({ type: RESOLVE_ERROR, message: e.message });
  }
};

export function* addNoteAsync() {
  yield takeLatest(ADD_NOTE_REQUESTED, addNote);
};

export function* addNote(action) {
  try {
    let { incidents: selectedIncidents, note, displayModal } = action;
    let { currentUser } = yield select(selectUsers);

    // Build individual requests as the endpoint supports singular POST
    let addNoteRequests = selectedIncidents.map(incident => {
      return call(pd, {
        method: "post",
        endpoint: `incidents/${incident.id}/notes`,
        headers: { "From": currentUser["email"] },
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
      if (displayModal) {
        let actionAlertsModalType = "success"
        let actionAlertsModalMessage = `Incident(s) ${selectedIncidents
          .map(i => i.incident_number)
          .join(", ")} have been updated with a note.`;
        yield displayActionModal(actionAlertsModalType, actionAlertsModalMessage);
      };
    } else {
      let errors = responses
        .filter((response) => response.data.error)
        .map((response) => response.data.error.message);
      if (errors.length) {
        throw Error(errors);
      } else {
        throw Error("Unknown error while using PD API");
      };
    };

  } catch (e) {
    yield displayActionModal("danger", e.message)
    yield put({ type: ADD_NOTE_ERROR, message: e.message });
  }
};

export function* toggleDisplayAddNoteModal() {
  yield takeLatest(TOGGLE_DISPLAY_ADD_NOTE_MODAL_REQUESTED, toggleDisplayAddNoteModalImpl);
};

export function* toggleDisplayAddNoteModalImpl() {
  let { displayAddNoteModal } = yield select(selectIncidentActions);
  yield put({ type: TOGGLE_DISPLAY_ADD_NOTE_MODAL_COMPLETED, displayAddNoteModal: !displayAddNoteModal });
};