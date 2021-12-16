/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest,
} from 'redux-saga/effects';

import { pd } from 'util/pd-api-wrapper';
import { UPDATE_CONNECTION_STATUS_REQUESTED } from 'redux/connection/actions';
import {
  FETCH_SERVICES_REQUESTED,
  FETCH_SERVICES_COMPLETED,
  FETCH_SERVICES_ERROR,
} from './actions';

import { selectServices } from './selectors';

export function* getServicesAsync() {
  yield takeLatest(FETCH_SERVICES_REQUESTED, getServices);
}

export function* getServices(action) {
  try {
    //  Create params and call pd lib
    const { teamIds } = action;
    const params = {};
    if (teamIds.length) params['team_ids[]'] = teamIds;

    const response = yield call(pd.all, 'services', { data: { ...params } });
    if (response.status !== 200) {
      throw Error('Unable to fetch services');
    }

    yield put({
      type: FETCH_SERVICES_COMPLETED,
      services: response.resource,
    });
  } catch (e) {
    yield put({ type: FETCH_SERVICES_ERROR, message: e.message });
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: e.message,
    });
  }
}
