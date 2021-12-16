/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest,
} from 'redux-saga/effects';

import { pd } from 'util/pd-api-wrapper';
import { UPDATE_CONNECTION_STATUS_REQUESTED } from 'redux/connection/actions';
import { FETCH_TEAMS_REQUESTED, FETCH_TEAMS_COMPLETED, FETCH_TEAMS_ERROR } from './actions';

import { selectTeams } from './selectors';

export function* getTeamsAsync() {
  yield takeLatest(FETCH_TEAMS_REQUESTED, getTeams);
}

export function* getTeams() {
  try {
    //  Create params and call pd lib
    const response = yield call(pd.all, 'teams');
    if (response.status !== 200) {
      throw Error('Unable to fetch teams');
    }

    yield put({
      type: FETCH_TEAMS_COMPLETED,
      teams: response.resource,
    });
  } catch (e) {
    yield put({ type: FETCH_TEAMS_ERROR, message: e.message });
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: e.message,
    });
  }
}
