import {
  put, call, select, takeLatest, take,
} from 'redux-saga/effects';

import {
  pd,
} from 'util/pd-api-wrapper';

import {
  FETCH_LOG_ENTRIES_COMPLETED, FETCH_LOG_ENTRIES_ERROR,
} from 'redux/log_entries/actions';

import {
  UPDATE_CONNECTION_STATUS_REQUESTED,
  UPDATE_CONNECTION_STATUS_COMPLETED,
  CHECK_CONNECTION_STATUS_REQUESTED,
  CHECK_CONNECTION_STATUS_COMPLETED,
  CHECK_ABILITIES_REQUESTED,
  CHECK_ABILITIES_COMPLETED,
  CHECK_ABILITIES_ERROR,
} from './actions';

export function* updateConnectionStatus() {
  yield takeLatest(UPDATE_CONNECTION_STATUS_REQUESTED, updateConnectionStatusImpl);
}

export function* updateConnectionStatusImpl(action) {
  const {
    connectionStatus, connectionStatusMessage,
  } = action;
  yield put({
    type: UPDATE_CONNECTION_STATUS_COMPLETED,
    connectionStatus,
    connectionStatusMessage,
  });
}

export function* checkConnectionStatus() {
  yield takeLatest(CHECK_CONNECTION_STATUS_REQUESTED, checkConnectionStatusImpl);
}

export function* checkConnectionStatusImpl() {
  // Wait until these actions have been dispatched before verifying connection status
  yield take([CHECK_ABILITIES_COMPLETED, CHECK_ABILITIES_ERROR]);
  yield take([FETCH_LOG_ENTRIES_COMPLETED, FETCH_LOG_ENTRIES_ERROR]);

  // Check entire store for fulfilled statuses
  const store = yield select();
  let validConnection = false;
  if (
    store.incidents.status.includes('COMPLETED')
    && store.logEntries.status.includes('COMPLETED')
    && store.services.status.includes('COMPLETED')
    && store.teams.status.includes('COMPLETED')
    && store.users.status.includes('COMPLETED')
    && store.escalationPolicies.status.includes('COMPLETED')
    && store.extensions.status.includes('COMPLETED')
    && store.responsePlays.status.includes('COMPLETED')
    && store.connection.status.includes('COMPLETED')
  ) {
    // Ignoring priorities as this is persisted to localcache
    validConnection = true;
  }

  // Update connection status depending on store state
  if (validConnection) {
    yield put({
      type: UPDATE_CONNECTION_STATUS_COMPLETED,
      connectionStatus: 'positive',
      connectionStatusMessage: 'Connected',
    });
  } else {
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: store.connection.connectionStatusMessage,
    });
  }
  yield put({ type: CHECK_CONNECTION_STATUS_COMPLETED });
}

export function* checkAbilities() {
  yield takeLatest(CHECK_ABILITIES_REQUESTED, checkAbilitiesAsync);
}

export function* checkAbilitiesAsync() {
  try {
    const response = yield call(pd.get, 'abilities');
    const {
      status,
    } = response;
    if (status !== 200) {
      throw Error('Unable to fetch account abilities');
    }
    const abilities = response.resource;
    yield put({ type: CHECK_ABILITIES_COMPLETED, abilities });
  } catch (e) {
    // Handle API auth failure
    if (e.status === 401) {
      e.message = 'Unauthorized Access';
    }
    yield put({ type: CHECK_ABILITIES_ERROR, message: e.message });
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: e.message,
    });
  }
}
