import {
  put, call, select, takeLatest,
} from 'redux-saga/effects';

import i18next from 'i18n';

import _ from 'lodash';

import {
  UPDATE_QUERY_SETTING_INCIDENT_PRIORITY_REQUESTED,
} from 'redux/query_settings/actions';
import {
  pd,
} from 'util/pd-api-wrapper';

import {
  UPDATE_CONNECTION_STATUS_REQUESTED,
} from 'redux/connection/actions';
import {
  FETCH_PRIORITIES_REQUESTED,
  FETCH_PRIORITIES_COMPLETED,
  FETCH_PRIORITIES_ERROR,
} from './actions';

import selectPriorities from './selectors';

export function* getPrioritiesAsync() {
  yield takeLatest(FETCH_PRIORITIES_REQUESTED, getPriorities);
}

export function* getPriorities() {
  try {
    //  Create params and call pd lib
    const response = yield call(pd.all, 'priorities');
    if (response.status !== 200) {
      throw Error(i18next.t('Unable to fetch priorities'));
    }
    const tempPriorities = response.resource;

    // Push an artificial priority (e.g. empty one)
    tempPriorities.push({ name: '--', id: '--', color: '000000' });

    // Compare existing priorities and determine if store needs to be updated.
    const {
      priorities,
    } = yield select(selectPriorities);
    if (!_.isEqual(priorities, tempPriorities)) {
      yield put({
        type: FETCH_PRIORITIES_COMPLETED,
        priorities: tempPriorities,
      });

      // Update default query list to include all priorities on app load
      const incidentPriority = tempPriorities.map((priority) => priority.id);
      yield put({
        type: UPDATE_QUERY_SETTING_INCIDENT_PRIORITY_REQUESTED,
        incidentPriority,
      });
    }
  } catch (e) {
    // Handle API auth failure
    if (e.status === 401) {
      e.message = i18next.t('Unauthorized Access');
    }
    yield put({ type: FETCH_PRIORITIES_ERROR, message: e.message });
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: e.message,
    });
  }
}
