import {
  put,
} from 'redux-saga/effects';

import {
  TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED,
  UPDATE_ACTION_ALERTS_MODAL_REQUESTED,
} from 'redux/action_alerts/actions';

// Helper function to handle errors while processing saga
export function* handleSagaError(action, exception) {
  yield displayActionModal('danger', exception.message);
  yield put({ type: action, message: exception.message });
}

// Helper functions to handle API errors in response
export const handleSingleAPIErrorResponse = (response) => {
  if (response.data.error) {
    throw Error(response.data.error.message);
  } else {
    throw Error('Unknown error while using PD API');
  }
};

export const handleMultipleAPIErrorResponses = (responses) => {
  const errors = responses
    .filter((response) => response.data.error)
    .map((response) => response.data.error.message);
  if (errors.length) {
    throw Error(errors);
  } else {
    throw Error('Unknown error while using PD API');
  }
};

// Helper function to display modal with API result
export function* displayActionModal(actionAlertsModalType, actionAlertsModalMessage) {
  yield put({
    type: UPDATE_ACTION_ALERTS_MODAL_REQUESTED,
    actionAlertsModalType,
    actionAlertsModalMessage,
  });
  yield put({ type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED });
}
