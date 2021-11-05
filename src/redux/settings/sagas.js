/* eslint-disable array-callback-return */
import { put, select, takeLatest } from 'redux-saga/effects';

import {
  TOGGLE_SETTINGS_REQUESTED,
  TOGGLE_SETTINGS_COMPLETED,
} from './actions';

import { selectSettings } from './selectors';

export function* toggleSettingsModal() {
  yield takeLatest(TOGGLE_SETTINGS_REQUESTED, toggleSettingsModalImpl);
}

export function* toggleSettingsModalImpl() {
  const { displaySettingsModal } = yield select(selectSettings);
  yield put({
    type: TOGGLE_SETTINGS_COMPLETED,
    displaySettingsModal: !displaySettingsModal,
  });
}
