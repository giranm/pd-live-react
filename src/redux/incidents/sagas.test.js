import {
  select,
} from 'redux-saga/effects';
import {
  expectSaga,
} from 'redux-saga-test-plan';

import {
  generateMockIncidents,
} from 'mocks/incidents.test';

import selectIncidentTable from 'redux/incident_table/selectors';

import {
  FILTER_INCIDENTS_LIST_BY_QUERY,
  FILTER_INCIDENTS_LIST_BY_QUERY_COMPLETED,
} from './actions';

import incidents from './reducers';
import selectIncidents from './selectors';
import {
  filterIncidentsByQuery,
} from './sagas';

describe('Sagas: Incidents', () => {
  const mockIncidents = generateMockIncidents(10);

  it('filterIncidentsByQuery: Empty Search', () => expectSaga(filterIncidentsByQuery)
    .withReducer(incidents)
    .provide([
      [select(selectIncidents), { incidents: mockIncidents, filteredIncidentsByQuery: [] }],
      [select(selectIncidentTable), { incidentTableColumns: [] }],
    ])
    .dispatch({
      type: FILTER_INCIDENTS_LIST_BY_QUERY,
      searchQuery: '',
    })
    .put({
      type: FILTER_INCIDENTS_LIST_BY_QUERY_COMPLETED,
      filteredIncidentsByQuery: mockIncidents,
    })
    .hasFinalState({
      incidents: [],
      filteredIncidentsByQuery: mockIncidents,
      status: FILTER_INCIDENTS_LIST_BY_QUERY_COMPLETED,
      fetchingData: false,
      fetchingIncidents: false,
      error: null,
    })
    .silentRun());

  it('filterIncidentsByQuery: Exact Incident Match', () => {
    const mockIncident = mockIncidents[0];
    const expectedIncidentResult = [mockIncident];
    return expectSaga(filterIncidentsByQuery)
      .withReducer(incidents)
      .provide([
        [select(selectIncidents), { incidents: mockIncidents, filteredIncidentsByQuery: [] }],
        [select(selectIncidentTable), { incidentTableColumns: [] }],
      ])
      .dispatch({
        type: FILTER_INCIDENTS_LIST_BY_QUERY,
        searchQuery: mockIncident.title,
      })
      .put({
        type: FILTER_INCIDENTS_LIST_BY_QUERY_COMPLETED,
        filteredIncidentsByQuery: expectedIncidentResult,
      })
      .hasFinalState({
        incidents: [],
        filteredIncidentsByQuery: expectedIncidentResult,
        status: FILTER_INCIDENTS_LIST_BY_QUERY_COMPLETED,
        fetchingData: false,
        fetchingIncidents: false,
        error: null,
      })
      .silentRun();
  });
});
