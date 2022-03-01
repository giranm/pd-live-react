import 'mocks/pdoauth';

import {
  select,
} from 'redux-saga/effects';
import {
  expectSaga,
} from 'redux-saga-test-plan';

import {
  UPDATE_USER_LOCALE_REQUESTED, UPDATE_USER_LOCALE_COMPLETED,
} from './actions';

import users from './reducers';
import selectUsers from './selectors';
import {
  updateUserLocale,
} from './sagas';

describe('Sagas: Users', () => {
  it('updateUserLocale', () => {
    const locale = 'en-US';
    return expectSaga(updateUserLocale)
      .withReducer(users)
      .dispatch({
        type: UPDATE_USER_LOCALE_REQUESTED,
        locale,
      })
      .put({
        type: UPDATE_USER_LOCALE_COMPLETED,
        currentUserLocale: locale,
      })
      .hasFinalState({
        users: [],
        usersMap: {},
        currentUser: null,
        currentUserLocale: locale,
        userAuthorized: false,
        userAcceptedDisclaimer: false,
        subdomain: '',
        status: UPDATE_USER_LOCALE_COMPLETED,
        fetchingData: false,
        error: null,
      })
      .silentRun();
  });
});
