import {
  put, call, select, takeLatest, take,
} from 'redux-saga/effects';

import {
  PD_SUBDOMAIN_ALLOW_LIST,
} from 'config/constants';
import {
  pd,
} from 'util/pd-api-wrapper';
import {
  convertListToMapById,
} from 'util/helpers';

import {
  UPDATE_CONNECTION_STATUS_REQUESTED,
} from 'redux/connection/actions';
import {
  USER_AUTHORIZE_REQUESTED,
  USER_AUTHORIZE_COMPLETED,
  USER_AUTHORIZE_ERROR,
  USER_UNAUTHORIZE_REQUESTED,
  USER_UNAUTHORIZE_COMPLETED,
  USER_UNAUTHORIZE_ERROR,
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

import selectUsers from './selectors';

export function* userAuthorize() {
  yield takeLatest(USER_AUTHORIZE_REQUESTED, userAuthorizeImpl);
}

export function* userAuthorizeImpl() {
  try {
    // Dispatch action to get current user
    yield put({ type: GET_CURRENT_USER_REQUESTED });
    yield take([GET_CURRENT_USER_COMPLETED]);

    // Extract allowed subdomains by comma seperated list and check against current user login
    const {
      currentUser,
    } = yield select(selectUsers);
    const currentSubdomain = currentUser.html_url.split('.')[0].split('https://')[1];
    const allowedSubdomains = PD_SUBDOMAIN_ALLOW_LIST.split(',');

    if (allowedSubdomains.includes('*') || allowedSubdomains.includes(currentSubdomain)) {
      yield put({
        type: USER_AUTHORIZE_COMPLETED,
        userAuthorized: true,
        subdomain: currentSubdomain,
      });
    } else {
      yield put({ type: USER_UNAUTHORIZE_REQUESTED });
    }
  } catch (e) {
    yield put({ type: USER_AUTHORIZE_ERROR, message: e.message });
  }
}

export function* userUnauthorize() {
  yield takeLatest(USER_UNAUTHORIZE_REQUESTED, userUnauthorizeImpl);
}

export function* userUnauthorizeImpl() {
  // Mark user as unauthorized (either from app perms or logout)
  try {
    yield put({
      type: USER_UNAUTHORIZE_COMPLETED,
      userAuthorized: false,
    });
  } catch (e) {
    yield put({ type: USER_UNAUTHORIZE_ERROR, message: e.message });
  }
}

export function* userAcceptDisclaimer() {
  yield takeLatest(USER_ACCEPT_DISCLAIMER_REQUESTED, userAcceptDisclaimerImpl);
}

export function* userAcceptDisclaimerImpl() {
  try {
    const {
      userAcceptedDisclaimer,
    } = yield select(selectUsers);
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
    if (response.status !== 200) {
      throw Error('Unable to fetch users');
    }
    const users = response.resource;
    const usersMap = convertListToMapById(users);
    yield put({
      type: GET_USERS_COMPLETED,
      users,
      usersMap,
    });
  } catch (e) {
    // Handle API auth failure
    if (e.status === 401) {
      e.message = 'Unauthorized Access';
    }
    yield put({ type: GET_USERS_ERROR, message: e.message });
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: e.message,
    });
  }
}

export function* getCurrentUserAsync() {
  yield takeLatest(GET_CURRENT_USER_REQUESTED, getCurrentUser);
}

export function* getCurrentUser() {
  try {
    const response = yield call(pd.get, 'users/me');
    if (response.status !== 200) {
      throw Error('Unable to fetch current user details');
    }
    yield put({
      type: GET_CURRENT_USER_COMPLETED,
      currentUser: response.data.user,
    });
  } catch (e) {
    // Handle API auth failure
    if (e.status === 401) {
      e.message = 'Unauthorized Access';
    }
    yield put({ type: GET_CURRENT_USER_ERROR, message: e.message });
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: e.message,
    });
  }
}
