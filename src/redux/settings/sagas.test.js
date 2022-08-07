import {
  expectSaga,
} from 'redux-saga-test-plan';

import {
  faker,
} from '@faker-js/faker';

import {
  MAX_INCIDENTS_LIMIT_LOWER, MAX_INCIDENTS_LIMIT_UPPER,
} from 'config/constants';

import settings from './reducers';
import {
  SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED,
  SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED,
  SET_ALERT_CUSTOM_DETAIL_COLUMNS_REQUESTED,
  SET_ALERT_CUSTOM_DETAIL_COLUMNS_COMPLETED,
  SET_MAX_INCIDENTS_LIMIT_REQUESTED,
  SET_MAX_INCIDENTS_LIMIT_COMPLETED,
  SET_AUTO_ACCEPT_INCIDENTS_QUERY_REQUESTED,
  SET_AUTO_ACCEPT_INCIDENTS_QUERY_COMPLETED,
} from './actions';
import {
  setDefaultSinceDateTenor,
  setAlertCustomDetailColumns,
  setMaxIncidentsLimit,
  setAutoAcceptIncidentsQuery,
} from './sagas';

describe('Sagas: Settings', () => {
  it('setDefaultSinceDateTenor', () => {
    const tenor = '1M';
    return expectSaga(setDefaultSinceDateTenor)
      .withReducer(settings)
      .dispatch({
        type: SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED,
        defaultSinceDateTenor: tenor,
      })
      .put({
        type: SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED,
        defaultSinceDateTenor: tenor,
      })
      .hasFinalState({
        displaySettingsModal: false,
        defaultSinceDateTenor: tenor,
        maxIncidentsLimit: 200,
        autoAcceptIncidentsQuery: false,
        alertCustomDetailFields: [
          {
            label: 'Environment:details.env',
            value: 'Environment:details.env',
            columnType: 'alert',
          },
        ],
        status: SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED,
      })
      .silentRun();
  });
  it('setAlertCustomDetailColumns', () => {
    const alertCustomDetailFields = [
      {
        label: faker.git.branch(),
        value: faker.git.branch(),
        columnType: 'alert',
      },
    ];
    return expectSaga(setAlertCustomDetailColumns)
      .withReducer(settings)
      .dispatch({
        type: SET_ALERT_CUSTOM_DETAIL_COLUMNS_REQUESTED,
        alertCustomDetailFields,
      })
      .put({
        type: SET_ALERT_CUSTOM_DETAIL_COLUMNS_COMPLETED,
        alertCustomDetailFields,
      })
      .hasFinalState({
        displaySettingsModal: false,
        defaultSinceDateTenor: '1 Day',
        maxIncidentsLimit: 200,
        autoAcceptIncidentsQuery: false,
        alertCustomDetailFields,
        status: SET_ALERT_CUSTOM_DETAIL_COLUMNS_COMPLETED,
      })
      .silentRun();
  });
  it('setMaxIncidentsLimit', () => {
    const maxIncidentsLimit = faker.datatype.number({
      min: MAX_INCIDENTS_LIMIT_LOWER,
      max: MAX_INCIDENTS_LIMIT_UPPER,
    });
    return expectSaga(setMaxIncidentsLimit)
      .withReducer(settings)
      .dispatch({
        type: SET_MAX_INCIDENTS_LIMIT_REQUESTED,
        maxIncidentsLimit,
      })
      .put({
        type: SET_MAX_INCIDENTS_LIMIT_COMPLETED,
        maxIncidentsLimit,
      })
      .hasFinalState({
        displaySettingsModal: false,
        defaultSinceDateTenor: '1 Day',
        maxIncidentsLimit,
        autoAcceptIncidentsQuery: false,
        alertCustomDetailFields: [
          {
            label: 'Environment:details.env',
            value: 'Environment:details.env',
            columnType: 'alert',
          },
        ],
        status: SET_MAX_INCIDENTS_LIMIT_COMPLETED,
      })
      .silentRun();
  });
  it('setAutoAcceptIncidentsQuery', () => {
    const autoAcceptIncidentsQuery = true;
    return expectSaga(setAutoAcceptIncidentsQuery)
      .withReducer(settings)
      .dispatch({
        type: SET_AUTO_ACCEPT_INCIDENTS_QUERY_REQUESTED,
        autoAcceptIncidentsQuery,
      })
      .put({
        type: SET_AUTO_ACCEPT_INCIDENTS_QUERY_COMPLETED,
        autoAcceptIncidentsQuery,
      })
      .hasFinalState({
        displaySettingsModal: false,
        defaultSinceDateTenor: '1 Day',
        maxIncidentsLimit: 200,
        autoAcceptIncidentsQuery,
        alertCustomDetailFields: [
          {
            label: 'Environment:details.env',
            value: 'Environment:details.env',
            columnType: 'alert',
          },
        ],
        status: SET_AUTO_ACCEPT_INCIDENTS_QUERY_COMPLETED,
      })
      .silentRun();
  });
});
