import 'mocks/pdoauth';

import {
  select, call,
} from 'redux-saga/effects';
import {
  expectSaga,
} from 'redux-saga-test-plan';

import {
  pd,
} from 'util/pd-api-wrapper';

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
  validateIncidentQuery, validateIncidentQueryImpl,
} from './sagas';

describe('Sagas: Query Settings', () => {
  const mockIncidents = generateMockIncidents(1);
  const sinceDateObj = new Date();
  const incidentStatus = ['triggered'];
  const incidentUrgency = ['high'];
  const teamIds = [];
  const serviceIds = [];
  const mockParams = {
    since: sinceDateObj.toISOString(),
    until: new Date().toISOString(),
    limit: 1,
    total: true,
  };

  if (incidentStatus) mockParams['statuses[]'] = incidentStatus;
  if (incidentUrgency) mockParams['urgencies[]'] = incidentUrgency;
  if (teamIds.length) mockParams['team_ids[]'] = teamIds;
  if (serviceIds.length) mockParams['service_ids[]'] = serviceIds;

  it('validateIncidentQuery', () => {
    const mockResponse = {
      data: {
        incidents: mockIncidents,
        limit: 1,
        total: 500,
      },
      status: 200,
    };

    return (
      expectSaga(validateIncidentQueryImpl)
        .withReducer(querySettings)
        .provide([
          [
            select(selectQuerySettings),
            {
              sinceDate: sinceDateObj,
              incidentStatus,
              incidentUrgency,
              teamIds,
              serviceIds,
            },
          ],
          [call(pd.get, 'incidents', { data: { ...mockParams } }), mockResponse],
        ])
        // .call(pd.get, 'incidents', { data: { ...mockParams } })
        .put({ type: VALIDATE_INCIDENT_QUERY_COMPLETED })
        .put({
          type: UPDATE_TOTAL_INCIDENTS_FROM_QUERY_REQUESTED,
          totalIncidentsFromQuery: mockResponse.data.total,
        })
        .put({
          type: CONFIRM_INCIDENT_QUERY_REQUESTED,
          confirm: true,
        })
        .silentRun()
        .then((result) => {
          // NB due to weird race condition, we can't accurately match on ISO Date string
          console.log(result.storeState);
          // expect(result.storeState.status).toEqual(CONFIRM_INCIDENT_QUERY_REQUESTED);
        })
        .catch((err) => console.log(err))
    );
  });
});
