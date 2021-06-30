/* eslint-disable array-callback-return */
import { put, call, select, takeLatest } from "redux-saga/effects";
import { api } from '@pagerduty/pdjs';

import {
  ACKNOWLEDGE_REQUESTED,
  ACKNOWLEDGE_COMPLETED,
  ACKNOWLEDGE_ERROR,
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
    let { incidents } = action;
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