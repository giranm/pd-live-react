/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest, take,
} from 'redux-saga/effects';

import { PD_SUBDOMAIN_ALLOW_LIST } from 'config/constants';
import { pd } from 'util/pd-api-wrapper';
import { convertListToMapById } from 'util/helpers';

import {
  USER_AUTHORIZE_REQUESTED,
  USER_AUTHORIZE_COMPLETED,
  USER_AUTHORIZE_ERROR,
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

export function* userAuthorize() {
  yield takeLatest(USER_AUTHORIZE_REQUESTED, userAuthorizeImpl);
}

export function* userAuthorizeImpl() {
  try {
    // Dispatch action to get current user
    yield put({ type: GET_CURRENT_USER_REQUESTED });
    yield take([GET_CURRENT_USER_COMPLETED]);

    // Extract allowed subdomains by comma seperated list and check against current user login
    const { currentUser } = yield select(selectUsers);
    const currentSubdomain = currentUser.html_url.split('.')[0].split('https://')[1];
    const allowedSubdomains = PD_SUBDOMAIN_ALLOW_LIST.split(',');
    let userAuthorized;

    if (allowedSubdomains.includes('*') || allowedSubdomains.includes(currentSubdomain)) {
      userAuthorized = true;
    } else {
      userAuthorized = false;
    }
    yield put({
      type: USER_AUTHORIZE_COMPLETED,
      userAuthorized,
    });
  } catch (e) {
    yield put({ type: USER_AUTHORIZE_ERROR, message: e.message });
  }
}

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
