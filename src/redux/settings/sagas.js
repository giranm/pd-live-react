import {
  put, select, takeLatest,
} from 'redux-saga/effects';

// eslint-disable-next-line import/no-cycle
import {
  persistor,
} from 'redux/store';

import {
  TOGGLE_SETTINGS_REQUESTED,
  TOGGLE_SETTINGS_COMPLETED,
  SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED,
  SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED,
  SET_ALERT_CUSTOM_DETAIL_COLUMNS_REQUESTED,
  SET_ALERT_CUSTOM_DETAIL_COLUMNS_COMPLETED,
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

export function* setDefaultSinceDateTenor() {
  yield takeLatest(SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED, setDefaultSinceDateTenorImpl);
}

export function* setDefaultSinceDateTenorImpl(action) {
  const {
    defaultSinceDateTenor,
  } = action;
  yield put({
    type: SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED,
    defaultSinceDateTenor,
  });
}

export function* setAlertCustomDetailColumns() {
  yield takeLatest(SET_ALERT_CUSTOM_DETAIL_COLUMNS_REQUESTED, setAlertCustomDetailColumnsImpl);
}

export function* setAlertCustomDetailColumnsImpl(action) {
  const {
    alertCustomDetailFields,
  } = action;
  yield put({
    type: SET_ALERT_CUSTOM_DETAIL_COLUMNS_COMPLETED,
    alertCustomDetailFields,
  });
}

export function* clearLocalCache() {
  yield takeLatest(CLEAR_LOCAL_CACHE_REQUESTED, clearLocalCacheImpl);
}

export function* clearLocalCacheImpl() {
  // Ref: https://github.com/wwayne/redux-reset/issues/7#issuecomment-496404924
  yield put({
    type: 'RESET',
  });
  yield persistor.purge();
  yield persistor.persist();
  yield put({
    type: CLEAR_LOCAL_CACHE_COMPLETED,
  });
}
