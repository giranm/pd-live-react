import {
  select,
} from 'redux-saga/effects';
import {
  expectSaga,
} from 'redux-saga-test-plan';

import {
  TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED,
  TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_COMPLETED,
  UPDATE_ACTION_ALERTS_MODAL_REQUESTED,
  UPDATE_ACTION_ALERTS_MODAL_COMPLETED,
} from './actions';
import actionAlertsModalData from './reducers';
import selectActionAlertsModalData from './selectors';
import {
  toggleActionAlertsModal, updateActionAlertsModal,
} from './sagas';

describe('Sagas: Action Alerts', () => {
  it('toggleActionAlertsModal', () => {
    const expectedDisplayActionAlertsModal = true;
    return (
      expectSaga(toggleActionAlertsModal)
        // This reducer is required to show up with hasFinalState
        .withReducer(actionAlertsModalData)
        // This is a form of dependency injection - mocking store from yield select()
        .provide([[select(selectActionAlertsModalData), { displayActionAlertsModal: false }]])
        // Dispatch actions taken for sagas
        .dispatch({ type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED })
        .put({
          type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_COMPLETED,
          displayActionAlertsModal: expectedDisplayActionAlertsModal,
        })
        // This asserts against the final state, but has to be against the entire store object
        .hasFinalState({
          displayActionAlertsModal: expectedDisplayActionAlertsModal,
          actionAlertsModalType: 'success',
          actionAlertsModalMessage: 'N/A',
          status: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_COMPLETED,
          fetchingData: false,
          error: null,
        })
        // This is used to suppress warnings about timeout - doesn't break tests
        .silentRun()
    );
  });
  it('updateActionAlertsModal', () => {
    const actionAlertsModalType = 'success';
    const actionAlertsModalMessage = 'Our mocks work!';
    return expectSaga(updateActionAlertsModal)
      .withReducer(actionAlertsModalData)
      .dispatch({
        type: UPDATE_ACTION_ALERTS_MODAL_REQUESTED,
        actionAlertsModalType,
        actionAlertsModalMessage,
      })
      .put({
        type: UPDATE_ACTION_ALERTS_MODAL_COMPLETED,
        actionAlertsModalType,
        actionAlertsModalMessage,
      })
      .hasFinalState({
        displayActionAlertsModal: false,
        actionAlertsModalType,
        actionAlertsModalMessage,
        status: UPDATE_ACTION_ALERTS_MODAL_COMPLETED,
        fetchingData: false,
        error: null,
      })
      .silentRun();
  });
});
