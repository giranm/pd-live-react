/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest,
} from 'redux-saga/effects';

import { pd } from 'util/pd-api-wrapper';

import {
  UPDATE_CONNECTION_STATUS_REQUESTED,
  UPDATE_CONNECTION_STATUS_COMPLETED,
  CHECK_CONNECTION_STATUS_REQUESTED,
  CHECK_CONNECTION_STATUS_COMPLETED,
} from './actions';

import { selectConnection } from './selectors';

export function* updateConnectionStatus() {
  yield takeLatest(UPDATE_CONNECTION_STATUS_REQUESTED, updateConnectionStatusImpl);
}

export function* updateConnectionStatusImpl(action) {
  const { connectionStatus, connectionStatusMessage } = action;
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
  // Check entire store for fulfilled statuses
  const store = yield select();
  let validConnection = false;
  if (store.incidents.status.includes('COMPLETED')
    && store.logEntries.status.includes('COMPLETED')
    && store.services.status.includes('COMPLETED')
    && store.teams.status.includes('COMPLETED')
    && store.users.status.includes('COMPLETED')
    && store.escalationPolicies.status.includes('COMPLETED')
    && store.extensions.status.includes('COMPLETED')
    && store.responsePlays.status.includes('COMPLETED')) {
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
