import 'mocks/pdoauth';

import {
  select,
} from 'redux-saga/effects';
import {
  expectSaga,
} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import {
  MAX_INCIDENTS_LIMIT,
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
  VALIDATE_INCIDENT_QUERY_REQUESTED,
  VALIDATE_INCIDENT_QUERY_COMPLETED,
  TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_REQUESTED,
  TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_COMPLETED,
  UPDATE_TOTAL_INCIDENTS_FROM_QUERY_REQUESTED,
  UPDATE_TOTAL_INCIDENTS_FROM_QUERY_COMPLETED,
  CONFIRM_INCIDENT_QUERY_REQUESTED,
  CONFIRM_INCIDENT_QUERY_COMPLETED,
  CONFIRM_INCIDENT_QUERY_ERROR,
} from './actions';
import querySettings from './reducers';
import selectQuerySettings from './selectors';
import {
  validateIncidentQueryImpl,
} from './sagas';

describe('Sagas: Query Settings', () => {
  const mockIncidents = generateMockIncidents(1);
  const mockSelector = {
    sinceDate: new Date(),
    incidentStatus: ['triggered'],
    incidentUrgency: ['high'],
    teamIds: [],
    serviceIds: [],
  };
  const expectedMockResponse = {
    data: {
      incidents: mockIncidents,
      limit: 1,
    },
  };

  it('validateIncidentQueryImpl: Within MAX_INCIDENTS_LIMIT', () => {
    expectedMockResponse.data.total = generateRandomInteger(1, MAX_INCIDENTS_LIMIT);
    expectedMockResponse.status = 200;
    return expectSaga(validateIncidentQueryImpl)
      .withReducer(querySettings)
      .provide([
        [select(selectQuerySettings), mockSelector],
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

  it('validateIncidentQueryImpl: Over MAX_INCIDENTS_LIMIT', () => {
    expectedMockResponse.data.total = generateRandomInteger(
      MAX_INCIDENTS_LIMIT + 1,
      MAX_INCIDENTS_LIMIT * 2,
    );
    expectedMockResponse.status = 200;
    return expectSaga(validateIncidentQueryImpl)
      .withReducer(querySettings)
      .provide([
        [select(selectQuerySettings), mockSelector],
        [matchers.call.fn(pd.get), expectedMockResponse],
      ])
      .silentRun()
      .then((result) => {
        expect(result.storeState.status).toEqual(TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_REQUESTED);
      });
  });
});
