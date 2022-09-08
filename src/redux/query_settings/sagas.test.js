import {
  select,
} from 'redux-saga/effects';
import {
  expectSaga,
} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import {
  MAX_INCIDENTS_LIMIT_LOWER,
} from 'config/constants';

import {
  pd,
} from 'util/pd-api-wrapper';
import {
  generateRandomInteger,
} from 'util/helpers';

import {
  generateMockIncidents,
} from 'mocks/incidents.test';

import {
  generateMockUsers,
} from 'mocks/users.test';

import {
  UPDATE_CONNECTION_STATUS_REQUESTED,
} from 'redux/connection/actions';
import connection from 'redux/connection/reducers';

import selectSettings from 'redux/settings/selectors';

import {
  TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_REQUESTED,
  TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_COMPLETED,
  UPDATE_TOTAL_INCIDENTS_FROM_QUERY_REQUESTED,
  UPDATE_TOTAL_INCIDENTS_FROM_QUERY_COMPLETED,
  CONFIRM_INCIDENT_QUERY_REQUESTED,
  CONFIRM_INCIDENT_QUERY_COMPLETED,
  CONFIRM_INCIDENT_QUERY_ERROR,
  UPDATE_QUERY_SETTINGS_USERS_REQUESTED,
  VALIDATE_INCIDENT_QUERY_REQUESTED,
} from './actions';
import querySettings from './reducers';
import selectQuerySettings from './selectors';
import {
  validateIncidentQueryImpl,
  toggleDisplayConfirmQueryModal,
  updateTotalIncidentsFromQuery,
  confirmIncidentQuery,
  updateQuerySettingsUsers,
} from './sagas';

describe('Sagas: Query Settings', () => {
  const mockIncidents = generateMockIncidents(1);
  const mockSelector = {
    sinceDate: new Date(),
    incidentStatus: ['triggered'],
    incidentUrgency: ['high'],
    teamIds: [],
    escalationPolicyIds: [],
    serviceIds: [],
    userIds: [],
  };
  const expectedMockResponse = {
    data: {
      incidents: mockIncidents,
      limit: 1,
    },
  };
  const mockSettings = {
    maxIncidentsLimit: MAX_INCIDENTS_LIMIT_LOWER,
    autoAcceptIncidentsQuery: false,
  };

  it('validateIncidentQueryImpl: Within MAX_INCIDENTS_LIMIT_LOWER', () => {
    expectedMockResponse.data.total = generateRandomInteger(1, MAX_INCIDENTS_LIMIT_LOWER);
    expectedMockResponse.status = 200;
    return expectSaga(validateIncidentQueryImpl)
      .withReducer(querySettings)
      .provide([
        [select(selectQuerySettings), mockSelector],
        [select(selectSettings), mockSettings],
        [
          // Matchers is used to mock API calls - ignores params used
          matchers.call.fn(pd.get),
          expectedMockResponse,
        ],
      ])
      .silentRun()
      .then((result) => {
        // NB due to weird race condition, we can't accurately match on ISO Date string
        expect(result.storeState.status).toEqual(CONFIRM_INCIDENT_QUERY_REQUESTED);
      });
  });

  it('validateIncidentQueryImpl: Over MAX_INCIDENTS_LIMIT_LOWER', () => {
    expectedMockResponse.data.total = generateRandomInteger(
      MAX_INCIDENTS_LIMIT_LOWER + 1,
      MAX_INCIDENTS_LIMIT_LOWER * 2,
    );
    expectedMockResponse.status = 200;
    return expectSaga(validateIncidentQueryImpl)
      .withReducer(querySettings)
      .provide([
        [select(selectQuerySettings), mockSelector],
        [select(selectSettings), mockSettings],
        [matchers.call.fn(pd.get), expectedMockResponse],
      ])
      .silentRun()
      .then((result) => {
        expect(result.storeState.status).toEqual(TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_REQUESTED);
      });
  });

  it('validateIncidentQueryImpl: Over MAX_INCIDENTS_LIMIT_LOWER with auto-accept query', () => {
    expectedMockResponse.data.total = generateRandomInteger(
      MAX_INCIDENTS_LIMIT_LOWER + 1,
      MAX_INCIDENTS_LIMIT_LOWER * 2,
    );
    expectedMockResponse.status = 200;
    mockSettings.autoAcceptIncidentsQuery = true;
    return expectSaga(validateIncidentQueryImpl)
      .withReducer(querySettings)
      .provide([
        [select(selectQuerySettings), mockSelector],
        [select(selectSettings), mockSettings],
        [matchers.call.fn(pd.get), expectedMockResponse],
      ])
      .silentRun()
      .then((result) => {
        expect(result.storeState.status).toEqual(CONFIRM_INCIDENT_QUERY_REQUESTED);
      });
  });

  it('validateIncidentQueryImpl: API Error', () => {
    expectedMockResponse.status = 429;
    return expectSaga(validateIncidentQueryImpl)
      .withReducer(connection)
      .provide([
        [select(selectQuerySettings), mockSelector],
        [select(selectSettings), mockSettings],
        [matchers.call.fn(pd.get), expectedMockResponse],
      ])
      .silentRun()
      .then((result) => {
        expect(result.storeState.status).toEqual(UPDATE_CONNECTION_STATUS_REQUESTED);
      });
  });

  it('toggleDisplayConfirmQueryModal: displayConfirmQueryModal === false', () => {
    mockSelector.displayConfirmQueryModal = false;
    const expectedResult = true;
    return expectSaga(toggleDisplayConfirmQueryModal)
      .withReducer(querySettings)
      .provide([
        [select(selectQuerySettings), mockSelector],
        [select(selectSettings), mockSettings],
      ])
      .dispatch({ type: TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_REQUESTED })
      .silentRun()
      .then((result) => {
        expect(result.storeState.displayConfirmQueryModal).toEqual(expectedResult);
        expect(result.storeState.status).toEqual(TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_COMPLETED);
      });
  });

  it('toggleDisplayConfirmQueryModal: displayConfirmQueryModal === true', () => {
    mockSelector.displayConfirmQueryModal = true;
    const expectedResult = false;
    return expectSaga(toggleDisplayConfirmQueryModal)
      .withReducer(querySettings)
      .provide([
        [select(selectQuerySettings), mockSelector],
        [select(selectSettings), mockSettings],
      ])
      .dispatch({ type: TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_REQUESTED })
      .silentRun()
      .then((result) => {
        expect(result.storeState.displayConfirmQueryModal).toEqual(expectedResult);
        expect(result.storeState.status).toEqual(TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_COMPLETED);
      });
  });

  it('updateTotalIncidentsFromQuery', () => {
    const totalIncidentsFromQuery = generateRandomInteger(0, MAX_INCIDENTS_LIMIT_LOWER);
    return expectSaga(updateTotalIncidentsFromQuery)
      .withReducer(querySettings)
      .dispatch({ type: UPDATE_TOTAL_INCIDENTS_FROM_QUERY_REQUESTED, totalIncidentsFromQuery })
      .silentRun()
      .then((result) => {
        expect(result.storeState.totalIncidentsFromQuery).toEqual(totalIncidentsFromQuery);
        expect(result.storeState.status).toEqual(UPDATE_TOTAL_INCIDENTS_FROM_QUERY_COMPLETED);
      });
  });

  it('confirmIncidentQuery: confirm === true', () => {
    const confirm = true;
    return expectSaga(confirmIncidentQuery)
      .withReducer(querySettings)
      .dispatch({ type: CONFIRM_INCIDENT_QUERY_REQUESTED, confirm })
      .silentRun()
      .then((result) => {
        expect(result.storeState.status).toEqual(CONFIRM_INCIDENT_QUERY_COMPLETED);
      });
  });

  it('confirmIncidentQuery: confirm === false', () => {
    const confirm = false;
    return expectSaga(confirmIncidentQuery)
      .withReducer(querySettings)
      .dispatch({ type: CONFIRM_INCIDENT_QUERY_REQUESTED, confirm })
      .silentRun()
      .then((result) => {
        expect(result.storeState.status).toEqual(CONFIRM_INCIDENT_QUERY_ERROR);
      });
  });

  it('updateQuerySettingsUsers', () => {
    const users = generateMockUsers(2);
    const userIds = users.map((user) => user.id);
    return expectSaga(updateQuerySettingsUsers)
      .withReducer(querySettings)
      .dispatch({ type: UPDATE_QUERY_SETTINGS_USERS_REQUESTED, userIds })
      .silentRun()
      .then((result) => {
        expect(result.storeState.userIds).toEqual(userIds);
        expect(result.storeState.status).toEqual(VALIDATE_INCIDENT_QUERY_REQUESTED);
      });
  });
});
