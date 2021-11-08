/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest,
} from 'redux-saga/effects';

import { pd } from 'util/pd-api-wrapper';
import { convertListToMapById } from 'util/helpers';

import {
  USER_ACCEPT_DISCLAIMER_REQUESTED,
  USER_ACCEPT_DISCLAIMER_COMPLETED,
  USER_ACCEPT_DISCLAIMER_ERROR,
  GET_USERS_REQUESTED,
  GET_USERS_COMPLETED,
  GET_USERS_ERROR,
  GET_CURRENT_USER_REQUESTED,
  GET_CURRENT_USER_COMPLETED,
  GET_CURRENT_USER_ERROR,
} from './actions';

import { selectUsers } from './selectors';

export function* userAcceptDisclaimer() {
  yield takeLatest(USER_ACCEPT_DISCLAIMER_REQUESTED, userAcceptDisclaimerImpl);
}

export function* userAcceptDisclaimerImpl() {
  try {
    const { userAcceptedDisclaimer } = yield select(selectUsers);
    yield put({
      type: USER_ACCEPT_DISCLAIMER_COMPLETED,
      userAcceptedDisclaimer: !userAcceptedDisclaimer,
    });
  } catch (e) {
    yield put({ type: USER_ACCEPT_DISCLAIMER_ERROR, message: e.message });
  }
}

export function* getUsersAsync() {
  yield takeLatest(GET_USERS_REQUESTED, getUsers);
}

export function* getUsers() {
  try {
    const response = yield call(pd.all, 'users');
    const users = response.resource;
    const usersMap = convertListToMapById(users);
    yield put({
      type: GET_USERS_COMPLETED,
      users,
      usersMap,
    });
  } catch (e) {
    yield put({ type: GET_USERS_ERROR, message: e.message });
  }
}

export function* getCurrentUserAsync() {
  yield takeLatest(GET_CURRENT_USER_REQUESTED, getCurrentUser);
}

export function* getCurrentUser() {
  try {
    const response = yield call(pd.get, 'users/me');
    yield put({
      type: GET_CURRENT_USER_COMPLETED,
      currentUser: response.data.user,
    });
  } catch (e) {
    yield put({ type: GET_CURRENT_USER_ERROR, message: e.message });
  }
}
