/* eslint-disable array-callback-return */
import { put, select, takeLatest } from "redux-saga/effects";

import {
  TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED,
  TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_COMPLETED,
  UPDATE_ACTION_ALERTS_MODAL_REQUESTED,
  UPDATE_ACTION_ALERTS_MODAL_COMPLETED,
} from "./actions";

import { selectActionAlertsModalData } from "./selectors";

export function* toggleActionAlertsModal() {
  yield takeLatest(TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED, toggleActionAlertsModalImpl);
};

export function* toggleActionAlertsModalImpl() {
  let { displayActionAlertsModal } = yield select(selectActionAlertsModalData);
  yield put({ type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_COMPLETED, displayActionAlertsModal: !displayActionAlertsModal });
};

export function* updateActionAlertsModal() {
  yield takeLatest(UPDATE_ACTION_ALERTS_MODAL_REQUESTED, updateActionAlertsModalImpl);
};

export function* updateActionAlertsModalImpl(action) {
  let { actionAlertsModalType, actionAlertsModalMessage } = action;
  yield put({ type: UPDATE_ACTION_ALERTS_MODAL_COMPLETED, actionAlertsModalType, actionAlertsModalMessage });
};