import {
  put, select, takeLatest,
} from 'redux-saga/effects';

import {
  TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_REQUESTED,
  TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_COMPLETED,
  UPDATE_INCIDENT_DETAILS_MODAL_REQUESTED,
  UPDATE_INCIDENT_DETAILS_MODAL_COMPLETED,
} from './actions';

import selectIncidentDetailsData from './selectors';

export function* toggleDisplayIncidentDetailsModal() {
  yield takeLatest(
    TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_REQUESTED,
    toggleDisplayIncidentDetailsModalImpl,
  );
}

export function* toggleDisplayIncidentDetailsModalImpl() {
  const {
    displayIncidentDetailsModal,
  } = yield select(selectIncidentDetailsData);
  yield put({
    type: TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_COMPLETED,
    displayIncidentDetailsModal: !displayIncidentDetailsModal,
  });
}

export function* updateIncidentDetailsModal() {
  yield takeLatest(UPDATE_INCIDENT_DETAILS_MODAL_REQUESTED, updateIncidentDetailsModalImpl);
}

export function* updateIncidentDetailsModalImpl(action) {
  const {
    incident,
  } = action;
  yield put({
    type: UPDATE_INCIDENT_DETAILS_MODAL_COMPLETED,
    incident,
  });
}
