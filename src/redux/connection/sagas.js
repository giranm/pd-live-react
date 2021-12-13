/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest,
} from 'redux-saga/effects';

import { pd } from 'util/pd-api-wrapper';

import {
  UPDATE_CONNECTION_STATUS_REQUESTED,
  UPDATE_CONNECTION_STATUS_COMPLETED,
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
