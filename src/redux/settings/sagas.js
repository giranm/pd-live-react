import {
  put, select, takeLatest,
} from 'redux-saga/effects';

import {
  PURGE,
} from 'redux-persist';

import {
  TOGGLE_SETTINGS_REQUESTED,
  TOGGLE_SETTINGS_COMPLETED,
  CLEAR_LOCAL_CACHE_REQUESTED,
  CLEAR_LOCAL_CACHE_COMPLETED,
} from './actions';

import selectSettings from './selectors';

export function* toggleSettingsModal() {
  yield takeLatest(TOGGLE_SETTINGS_REQUESTED, toggleSettingsModalImpl);
}

export function* toggleSettingsModalImpl() {
  const {
    displaySettingsModal,
  } = yield select(selectSettings);
  yield put({
    type: TOGGLE_SETTINGS_COMPLETED,
    displaySettingsModal: !displaySettingsModal,
  });
}

export function* clearLocalCache() {
  yield takeLatest(CLEAR_LOCAL_CACHE_REQUESTED, clearLocalCacheImpl);
}

export function* clearLocalCacheImpl() {
  yield put({
    type: PURGE,
    key: 'root',
    result: () => null,
  });
  yield put({
    type: PURGE,
    key: 'incidentTable.incidentTableState',
    result: () => null,
  });
  yield put({
    type: CLEAR_LOCAL_CACHE_COMPLETED,
  });
}
