import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';

import {
  TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_COMPLETED,
} from './actions';
import actionAlertsModalData from './reducers';
import selectActionAlertsModalData from './selectors';
import { toggleActionAlertsModalImpl } from './sagas';

it('toggleActionAlertsModalImpl', () => {
  const expectedDisplayActionAlertsModal = true;
  return expectSaga(toggleActionAlertsModalImpl)
    // This reducer is required to show up with hasFinalState
    .withReducer(actionAlertsModalData)
    // This is a form of dependency injection - mocking store from yield select()
    .provide([[select(selectActionAlertsModalData), { displayActionAlertsModal: false }]])
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
    .run();
});
