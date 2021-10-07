/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest,
} from 'redux-saga/effects';
import { api } from '@pagerduty/pdjs';

import { FETCH_TEAMS_REQUESTED, FETCH_TEAMS_COMPLETED, FETCH_TEAMS_ERROR } from './actions';

import { selectTeams } from './selectors';

const token = sessionStorage.getItem('pd_access_token');
const pd = api({ token, tokenType: 'bearer' });

export function* getTeamsAsync() {
  yield takeLatest(FETCH_TEAMS_REQUESTED, getTeams);
}

export function* getTeams() {
  try {
    //  Create params and call pd lib
    const response = yield call(pd.all, 'teams');

    yield put({
      type: FETCH_TEAMS_COMPLETED,
      teams: response.resource,
    });
  } catch (e) {
    yield put({ type: FETCH_TEAMS_ERROR, message: e.message });
  }
}
