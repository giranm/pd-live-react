import 'mocks/pdoauth';

import {
  // eslint-disable-next-line no-unused-vars
  select,
} from 'redux-saga/effects';
import {
  expectSaga,
} from 'redux-saga-test-plan';

import {
  SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED,
  SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED,
} from './actions';

import settings from './reducers';
// eslint-disable-next-line no-unused-vars
import selectSettings from './selectors';
import {
  setDefaultSinceDateTenor,
} from './sagas';

describe('Sagas: Settings', () => {
  it('setDefaultSinceDateTenor', () => {
    const tenor = '1M';
    return expectSaga(setDefaultSinceDateTenor)
      .withReducer(settings)
      .dispatch({
        type: SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED,
        defaultSinceDateTenor: tenor,
      })
      .put({
        type: SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED,
        defaultSinceDateTenor: tenor,
      })
      .hasFinalState({
        displaySettingsModal: false,
        defaultSinceDateTenor: tenor,
        status: SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED,
      })
      .silentRun();
  });
});
