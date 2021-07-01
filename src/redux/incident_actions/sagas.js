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
  RESOLVE_REQUESTED,
  RESOLVE_COMPLETED,
  RESOLVE_ERROR,
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
  SNOOZE_TIMES,
  filterIncidentsByField
} from "util/incidents";

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

export function* acknowledgeAsync() {
  yield takeLatest(ACKNOWLEDGE_REQUESTED, acknowledge);
};

export function* acknowledge(action) {
  try {
    //  Create params and call pd lib
    let { incidents, displayModal } = action;
    let { currentUser } = yield select(selectUsers);

    let incidentsToBeAcknowledged = filterIncidentsByField(incidents, "status", [TRIGGERED, ACKNOWLEDGED]);
    let incidentsNotToBeAcknowledged = filterIncidentsByField(incidents, "status", [RESOLVED]);

    // Build request manually given PUT
    let headers = {
      "From": currentUser["email"]
    };

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
      headers,
      data
    });

    // Determine how store is updated based on response
    if (response.ok) {
      yield put({
        type: ACKNOWLEDGE_COMPLETED,
        acknowledgedIncidents: response.resource
      });

      // Dispatch alert modal message upon success
      if (displayModal) {
        let actionAlertsModalType = "success";
        let actionAlertsModalMessage;
        let acknowledgedMessage = `Incident(s) ${incidentsToBeAcknowledged
          .map(i => i.incident_number)
          .join(", ")} have been acknowledged.`;

        if (incidentsNotToBeAcknowledged.length === 0) {
          actionAlertsModalMessage = acknowledgedMessage;
        } else {
          let unAcknowledgedMessage = `(${incidentsNotToBeAcknowledged.length} Incidents were not acknowledged because they have already been suppressed or resolved)`;
          actionAlertsModalMessage = `${acknowledgedMessage} ${unAcknowledgedMessage}`;
        }

        yield put({ type: UPDATE_ACTION_ALERTS_MODAL_REQUESTED, actionAlertsModalType, actionAlertsModalMessage });
        yield put({ type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED });
      };

    } else {
      if (response.data.error) {
        throw Error(response.data.error.message);
      } else {
        throw Error("Unknown error while using PD API");
      };
    };

  } catch (e) {
    // Render alert modal on failure
    let actionAlertsModalType = "danger";
    let actionAlertsModalMessage = e.message;
    yield put({ type: UPDATE_ACTION_ALERTS_MODAL_REQUESTED, actionAlertsModalType, actionAlertsModalMessage });
    yield put({ type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED });
    yield put({ type: ACKNOWLEDGE_ERROR, message: e.message });
  }
};

export function* snoozeAsync() {
  yield takeLatest(SNOOZE_REQUESTED, snooze);
};

export function* snooze(action) {
  try {
    //  Create params and call pd lib
    let { incidents, duration, displayModal } = action;
    let { currentUser } = yield select(selectUsers);

    // In order to snooze, triggered incidents must be acknowledged first; modal will be hidden.
    yield put({ type: ACKNOWLEDGE_REQUESTED, incidents, displayModal: false });

    let incidentsToBeSnoozed = filterIncidentsByField(incidents, "status", [TRIGGERED, ACKNOWLEDGED]);
    let incidentsNotToBeSnoozed = filterIncidentsByField(incidents, "status", [RESOLVED]);

    // Build individual requests as the endpoint supports singular POST
    let headers = {
      "From": currentUser["email"]
    };

    let data = {
      duration: SNOOZE_TIMES[duration]
    };

    let snoozeRequests = incidentsToBeSnoozed.map(incident => {
      return call(pd, {
        method: "post",
        endpoint: `incidents/${incident.id}/snooze`,
        headers,
        data
      })
    });

    // Invoke parallel calls for optimal performance
    let responses = yield all(snoozeRequests);

    // Determine how store is updated based on response
    if (responses.every((response) => response.ok)) {
      yield put({
        type: SNOOZE_COMPLETED,
        snoozedIncidents: responses
      });

      // Dispatch alert modal message upon success
      if (displayModal) {
        let actionAlertsModalType = "success";
        let actionAlertsModalMessage;
        let snoozedMessage = `Incident(s) ${incidentsToBeSnoozed
          .map(i => i.incident_number)
          .join(", ")} have been snoozed for ${duration}.`;

        if (incidentsNotToBeSnoozed.length === 0) {
          actionAlertsModalMessage = snoozedMessage;
        } else {
          let unsnoozedMessage = `(${incidentsNotToBeSnoozed.length} Incidents were not snoozed because they have already been suppressed or resolved)`;
          actionAlertsModalMessage = `${snoozedMessage} ${unsnoozedMessage}`;
        }

        yield put({ type: UPDATE_ACTION_ALERTS_MODAL_REQUESTED, actionAlertsModalType, actionAlertsModalMessage });
        yield put({ type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED });
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
    }

  } catch (e) {
    // Render alert modal on failure
    let actionAlertsModalType = "danger";
    let actionAlertsModalMessage = e.message;
    yield put({ type: UPDATE_ACTION_ALERTS_MODAL_REQUESTED, actionAlertsModalType, actionAlertsModalMessage });
    yield put({ type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED });
    yield put({ type: SNOOZE_ERROR, message: e.message });
  }
};

export function* resolveAsync() {
  yield takeLatest(RESOLVE_REQUESTED, resolve);
};

export function* resolve(action) {
  try {
    //  Create params and call pd lib
    let { incidents, displayModal } = action;
    let { currentUser } = yield select(selectUsers);

    let incidentsToBeResolved = filterIncidentsByField(incidents, "status", [TRIGGERED, ACKNOWLEDGED]);
    let incidentsNotToBeResolved = filterIncidentsByField(incidents, "status", [RESOLVED]);

    // Build request manually given PUT
    let headers = {
      "From": currentUser["email"]
    };

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
      headers,
      data
    });

    // Determine how store is updated based on response
    if (response.ok) {
      yield put({
        type: RESOLVE_COMPLETED,
        resolvedIncidents: response.resource
      });

      // Dispatch alert modal message upon success
      if (displayModal) {
        let actionAlertsModalType = "success";
        let actionAlertsModalMessage;
        let resolvedMessage = `Incident(s) ${incidentsToBeResolved
          .map(i => i.incident_number)
          .join(", ")} have been resolved.`;
        let unresolvedMessage = `(${incidentsNotToBeResolved.length} Incidents were not resolved because they have already been suppressed or resolved)`;

        if (incidentsToBeResolved.length > 0 && incidentsNotToBeResolved.length === 0) {
          actionAlertsModalMessage = resolvedMessage;
        } else if (incidentsToBeResolved.length > 0 && incidentsNotToBeResolved.length > 0) {
          actionAlertsModalMessage = `${resolvedMessage} ${unresolvedMessage}`;
        } else if (incidentsToBeResolved.length === 0 && incidentsNotToBeResolved.length > 0) {
          actionAlertsModalMessage = `${unresolvedMessage}`;
        }

        yield put({ type: UPDATE_ACTION_ALERTS_MODAL_REQUESTED, actionAlertsModalType, actionAlertsModalMessage });
        yield put({ type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED });
      };

    } else {
      if (response.data.error) {
        throw Error(response.data.error.message);
      } else {
        throw Error("Unknown error while using PD API");
      };
    };

  } catch (e) {
    // Render alert modal on failure
    let actionAlertsModalType = "danger";
    let actionAlertsModalMessage = e.message;
    yield put({ type: UPDATE_ACTION_ALERTS_MODAL_REQUESTED, actionAlertsModalType, actionAlertsModalMessage });
    yield put({ type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED });
    yield put({ type: RESOLVE_ERROR, message: e.message });
  }
};