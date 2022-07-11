/* eslint-disable import/prefer-default-export */
import {
  put, call,
} from 'redux-saga/effects';

import {
  pd,
} from 'util/pd-api-wrapper';

import {
  UPDATE_CONNECTION_STATUS_REQUESTED,
} from 'redux/connection/actions';

export function* getAlerts(since) {
  let alerts = [];
  try {
    //  Create params and call pd lib
    const params = {
      since: since.toISOString().replace(/\.[\d]{3}/, ''),
    };
    const response = yield call(pd.all, 'alerts', { data: { ...params } });
    if (response.status !== 200) {
      throw Error('Unable to fetch alerts');
    }
    alerts = response.resource;
  } catch (e) {
    // Handle API auth failure
    if (e.status === 401) {
      e.message = 'Unauthorized Access';
    }
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: e.message,
    });
  }
  return alerts;
}
