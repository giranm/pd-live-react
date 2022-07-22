import {
  expectSaga,
} from 'redux-saga-test-plan';

import {
  faker,
} from '@faker-js/faker';

import settings from './reducers';
import {
  SET_DEFAULT_SINCE_DATE_TENOR_REQUESTED,
  SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED,
  SET_ALERT_CUSTOM_DETAIL_COLUMNS_REQUESTED,
  SET_ALERT_CUSTOM_DETAIL_COLUMNS_COMPLETED,
} from './actions';
import {
  setDefaultSinceDateTenor, setAlertCustomDetailColumns,
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
        status: SET_DEFAULT_SINCE_DATE_TENOR_COMPLETED,
        alertCustomDetailFields: [
          {
            label: 'Environment:details.env',
            value: 'Environment:details.env',
            columnType: 'alert',
          },
        ],
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
        status: SET_ALERT_CUSTOM_DETAIL_COLUMNS_COMPLETED,
        alertCustomDetailFields,
      })
      .silentRun();
  });
});
