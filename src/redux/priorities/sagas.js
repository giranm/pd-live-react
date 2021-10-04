/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest,
} from 'redux-saga/effects';
import { api } from '@pagerduty/pdjs';

import { UPDATE_QUERY_SETTING_INCIDENT_PRIORITY_REQUESTED } from 'redux/query_settings/actions';
import {
  FETCH_PRIORITIES_REQUESTED,
  FETCH_PRIORITIES_COMPLETED,
  FETCH_PRIORITIES_ERROR,
} from './actions';

import { selectPriorities } from './selectors';

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

export function* getPrioritiesAsync() {
  yield takeLatest(FETCH_PRIORITIES_REQUESTED, getPriorities);
}

export function* getPriorities() {
  try {
    //  Create params and call pd lib
    const response = yield call(pd.all, 'priorities');
    const priorities = response.resource;

    // Push an artificial priority (e.g. empty one)
    priorities.push({ name: '--', id: '--', color: '000000' });

    yield put({
      type: FETCH_PRIORITIES_COMPLETED,
      priorities,
    });

    // Update default query list to include all priorities on app load
    const incidentPriority = priorities.map((priority) => priority.id);
    yield put({
      type: UPDATE_QUERY_SETTING_INCIDENT_PRIORITY_REQUESTED,
      incidentPriority,
    });
  } catch (e) {
    yield put({ type: FETCH_PRIORITIES_ERROR, message: e.message });
  }
}
