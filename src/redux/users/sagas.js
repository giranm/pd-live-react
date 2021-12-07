/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest,
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

    // Extract allowed subdomains by comma seperated list and check against current user login
    const { currentUser } = yield select(selectUsers);
    const currentSubdomain = currentUser
      ? currentUser.html_url.split('.')[0].split('https://')[1]
      : 'N/A';
    const allowedSubdomains = PD_SUBDOMAIN_ALLOW_LIST.split(',');

    console.log('currentSubdomain', currentSubdomain);
    console.log('allowedSubdomains', allowedSubdomains);

    if (allowedSubdomains.includes('*') || allowedSubdomains.includes(currentSubdomain)) {
      // Allow current user from any or allowed subdomain to use app
      console.log('allowing user');
      yield put({
        type: USER_AUTHORIZE_COMPLETED,
        userAuthorized: true,
      });
    } else {
      // Block current user from using app (as subdomain doesn't match)
      console.log('blocking user');
      yield put({
        type: USER_AUTHORIZE_COMPLETED,
        userAuthorized: false,
      });
    }
  } catch (e) {
    console.log('error', e);
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
