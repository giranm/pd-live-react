/* eslint-disable array-callback-return */
import { put, select, takeLatest } from "redux-saga/effects";

import {
  TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED,
  TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_COMPLETED,
  UPDATE_ACTION_ALERTS_MODAL_TYPE_REQUESTED,
  UPDATE_ACTION_ALERTS_MODAL_TYPE_COMPLETED,
  UPDATE_ACTION_ALERTS_MODAL_MESSAGE_REQUESTED,
  UPDATE_ACTION_ALERTS_MODAL_MESSAGE_COMPLETED
} from "./actions";

import { selectActionAlertsModalData } from "./selectors";

export function* toggleActionAlertsModal() {
  yield takeLatest(TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED, toggleActionAlertsModalImpl);
};

export function* toggleActionAlertsModalImpl() {
  let { displayActionAlertsModal } = yield select(selectActionAlertsModalData);
  yield put({ type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_COMPLETED, displayActionAlertsModal: !displayActionAlertsModal });
};

export function* updateActionAlertsModalType() {
  yield takeLatest(UPDATE_ACTION_ALERTS_MODAL_TYPE_REQUESTED, updateActionAlertsModalTypeImpl);
};

export function* updateActionAlertsModalTypeImpl(action) {
  let { actionAlertsModalType } = action;
  yield put({ type: UPDATE_ACTION_ALERTS_MODAL_TYPE_COMPLETED, actionAlertsModalType });
};

export function* updateActionAlertsModalMessage() {
  yield takeLatest(UPDATE_ACTION_ALERTS_MODAL_MESSAGE_REQUESTED, updateActionAlertsModalMessageImpl);
};

export function* updateActionAlertsModalMessageImpl(action) {
  let { actionAlertsModalMessage } = action;
  yield put({ type: UPDATE_ACTION_ALERTS_MODAL_MESSAGE_COMPLETED, actionAlertsModalMessage });
};