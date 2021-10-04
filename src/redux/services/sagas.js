/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest,
} from 'redux-saga/effects';
import { api } from '@pagerduty/pdjs';

import {
  FETCH_SERVICES_REQUESTED,
  FETCH_SERVICES_COMPLETED,
  FETCH_SERVICES_ERROR,
} from './actions';

import { selectServices } from './selectors';

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

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

    yield put({
      type: FETCH_SERVICES_COMPLETED,
      services: response.resource,
    });
  } catch (e) {
    yield put({ type: FETCH_SERVICES_ERROR, message: e.message });
  }
}
