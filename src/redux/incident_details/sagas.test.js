import {
  select,
} from 'redux-saga/effects';
import {
  expectSaga,
} from 'redux-saga-test-plan';

import {
  TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_REQUESTED,
  TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_COMPLETED,
  UPDATE_INCIDENT_DETAILS_MODAL_REQUESTED,
  UPDATE_INCIDENT_DETAILS_MODAL_COMPLETED,
} from './actions';
import incidentDetails from './reducers';
import selectIncidentDetails from './selectors';
import {
  toggleDisplayIncidentDetailsModal, updateIncidentDetailsModal,
} from './sagas';

describe('Sagas: Incident Details', () => {
  it('toggleIncidentDetailsModal', () => {
    const expectedDisplayIncidentDetailsModal = true;
    return expectSaga(toggleDisplayIncidentDetailsModal)
      .withReducer(incidentDetails)
      .provide([[select(selectIncidentDetails), { displayIncidentDetailsModal: false }]])
      .dispatch({ type: TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_REQUESTED })
      .put({
        type: TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_COMPLETED,
        displayIncidentDetailsModal: expectedDisplayIncidentDetailsModal,
      })
      .hasFinalState({
        displayIncidentDetailsModal: expectedDisplayIncidentDetailsModal,
        incident: null,
        status: TOGGLE_DISPLAY_INCIDENT_DETAILS_MODAL_COMPLETED,
        fetchingData: false,
        error: null,
      })
      .silentRun();
  });
  it('updateIncidentDetailsModal', () => {
    const incident = {};
    return expectSaga(updateIncidentDetailsModal)
      .withReducer(incidentDetails)
      .dispatch({
        type: UPDATE_INCIDENT_DETAILS_MODAL_REQUESTED,
        incident,
      })
      .put({
        type: UPDATE_INCIDENT_DETAILS_MODAL_COMPLETED,
        incident,
      })
      .hasFinalState({
        displayIncidentDetailsModal: false,
        incident,
        status: UPDATE_INCIDENT_DETAILS_MODAL_COMPLETED,
        fetchingData: false,
        error: null,
      })
      .silentRun();
  });
});
