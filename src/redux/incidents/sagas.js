/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest, takeEvery, all,
} from 'redux-saga/effects';
import { api } from '@pagerduty/pdjs';

import { selectQuerySettings } from 'redux/query_settings/selectors';

import { pushToArray } from 'util/helpers';
import { filterIncidentsByField, filterIncidentsByFieldOfList } from 'util/incidents';
import { selectIncidents } from './selectors';
import {
  FETCH_INCIDENTS_REQUESTED,
  FETCH_INCIDENTS_COMPLETED,
  FETCH_INCIDENTS_ERROR,
  FETCH_INCIDENT_NOTES_REQUESTED,
  FETCH_INCIDENT_NOTES_COMPLETED,
  FETCH_INCIDENT_NOTES_ERROR,
  UPDATE_INCIDENTS_LIST,
  UPDATE_INCIDENTS_LIST_COMPLETED,
  UPDATE_INCIDENTS_LIST_ERROR,
  FILTER_INCIDENTS_LIST_BY_PRIORITY,
  FILTER_INCIDENTS_LIST_BY_PRIORITY_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_PRIORITY_ERROR,
  FILTER_INCIDENTS_LIST_BY_STATUS,
  FILTER_INCIDENTS_LIST_BY_STATUS_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_STATUS_ERROR,
  FILTER_INCIDENTS_LIST_BY_URGENCY,
  FILTER_INCIDENTS_LIST_BY_URGENCY_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_URGENCY_ERROR,
  FILTER_INCIDENTS_LIST_BY_TEAM,
  FILTER_INCIDENTS_LIST_BY_TEAM_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_TEAM_ERROR,
  FILTER_INCIDENTS_LIST_BY_SERVICE,
  FILTER_INCIDENTS_LIST_BY_SERVICE_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_SERVICE_ERROR,
} from './actions';

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

export const getIncidentByIdRequest = (incidentId) => call(pd, {
  method: 'get',
  endpoint: `incidents/${incidentId}`,
  data: {
    'include[]': ['external_references'],
  },
});

export function* getIncidentsAsync() {
  yield takeLatest(FETCH_INCIDENTS_REQUESTED, getIncidents);
}

export function* getIncidents(action) {
  try {
    //  Build params from query settings and call pd lib
    const {
      sinceDate,
      untilDate,
      incidentStatus,
      incidentUrgency,
      teamIds,
      serviceIds,
      incidentPriority,
    } = yield select(selectQuerySettings);

    const params = {
      since: sinceDate.toISOString(),
      until: untilDate.toISOString(),
      'include[]': ['first_trigger_log_entries', 'external_references'],
    };

    if (incidentStatus) params['statuses[]'] = incidentStatus;

    if (incidentUrgency) params['urgencies[]'] = incidentUrgency;

    if (teamIds.length) params['team_ids[]'] = teamIds;

    if (serviceIds.length) params['service_ids[]'] = serviceIds;

    const response = yield call(pd.all, 'incidents', { data: { ...params } });
    const incidents = response.resource;

    yield put({
      type: FETCH_INCIDENTS_COMPLETED,
      incidents,
    });

    // Get notes for each incident (implictly updates store)
    yield all(
      incidents
        .map((incident) => incident.id)
        .map((incidentId) => put({ type: FETCH_INCIDENT_NOTES_REQUESTED, incidentId })),
    );

    // Filter incident list on priority (can't do this from API)
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_PRIORITY,
      incidentPriority,
    });
  } catch (e) {
    yield put({ type: FETCH_INCIDENTS_ERROR, message: e.message });
  }
}

export function* getIncidentNotesAsync() {
  yield takeEvery(FETCH_INCIDENT_NOTES_REQUESTED, getIncidentNotes);
}

export function* getIncidentNotes(action) {
  try {
    // Call PD API to grab note for given Incident ID
    const { incidentId } = action;
    const response = yield call(pd.get, `incidents/${incidentId}/notes`);
    const { notes } = response.data;

    // Grab matching incident and apply note update
    const { incidents } = yield select(selectIncidents);
    const updatedIncidentsList = incidents.map((incident) => {
      if (incident.id === incidentId) {
        const tempIncident = { ...incident };
        tempIncident.notes = notes;
        return tempIncident;
      }
      return incident;
    });

    // Update store with incident having notes data
    yield put({ type: FETCH_INCIDENT_NOTES_COMPLETED, incidents: updatedIncidentsList });
  } catch (e) {
    yield put({ type: FETCH_INCIDENT_NOTES_ERROR, message: e.message });
  }
}

export function* updateIncidentsListAsync() {
  yield takeEvery(UPDATE_INCIDENTS_LIST, updateIncidentsList);
}

export function* updateIncidentsList(action) {
  try {
    const { addList, updateList, removeList } = action;
    const { incidents } = yield select(selectIncidents);
    const {
      incidentPriority, incidentStatus, incidentUrgency, teamIds, serviceIds,
    } = yield select(
      selectQuerySettings,
    );
    let updatedIncidentsList = [...incidents];

    // Add new incidents to list (need to re-query to get external_references)
    const addListRequests = addList.map((addItem) => {
      if (addItem.incident) return getIncidentByIdRequest(addItem.incident.id);
    });
    const addListResponses = yield all(addListRequests);
    addListResponses.map((response) => updatedIncidentsList.push(response.data.incident));

    // Update existing incidents within list
    if (incidents.length && updateList.length) {
      updatedIncidentsList = updatedIncidentsList.map((existingIncident) => {
        const updatedItem = updateList.find((updateItem) => {
          if (updateItem.incident) return updateItem.incident.id === existingIncident.id;
        });
        const updatedIncident = updatedItem ? updatedItem.incident : null;
        return updatedIncident ? { ...existingIncident, ...updatedIncident } : existingIncident;
      });
    }

    // Handle cases where new updates come in against an empty incident list or filtered out incidents
    if (updateList.length) {
      updateList.map((updateItem) => {
        if (updateItem.incident) {
          // Check if item is matched against updatedIncidentsList (skip)
          if (updatedIncidentsList.find((incident) => incident.id === updateItem.incident.id)) return;

          // Update incident list (push if we haven't updated already)
          pushToArray(updatedIncidentsList, updateItem.incident, 'id');
        }
      });
    }

    // Remove incidents within list
    updatedIncidentsList = updatedIncidentsList.filter((existingIncident) => !removeList.some((removeItem) => {
      if (removeItem.incident) return removeItem.incident.id === existingIncident.id;
    }));

    // Remove any unintentional duplicate incidents (i.e. new incident triggered)
    const updatedIncidentsIds = updatedIncidentsList.map((o) => o.id);
    const uniqueUpdatedIncidentsList = updatedIncidentsList.filter(
      ({ id }, index) => !updatedIncidentsIds.includes(id, index + 1),
    );

    // Update store with updated list of incidents
    yield put({ type: UPDATE_INCIDENTS_LIST_COMPLETED, incidents: uniqueUpdatedIncidentsList });

    /*
      Apply filters that already are configured down below
    */

    // Filter updated incident list on priority (can't do this from API)
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_PRIORITY,
      incidentPriority,
    });

    // Filter updated incident list on status
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_STATUS,
      incidentStatus,
    });

    // Filter updated incident list on urgency
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_URGENCY,
      incidentUrgency,
    });

    // Filter updated incident list on team
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_TEAM,
      teamIds,
    });

    // Filter updated incident list on service
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_SERVICE,
      serviceIds,
    });
  } catch (e) {
    yield put({ type: UPDATE_INCIDENTS_LIST_ERROR, message: e.message });
  }
}

export function* filterIncidentsByPriority() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_PRIORITY, filterIncidentsByPriorityImpl);
}

export function* filterIncidentsByPriorityImpl(action) {
  // Filter current incident list by priority
  try {
    const { incidentPriority } = action;
    const { incidents } = yield select(selectIncidents);
    const filteredIncidentsByPriorityList = incidents.filter((incident) => {
      // Incident priority is not always defined - need to check this
      if (incident.priority && incidentPriority.includes(incident.priority.id)) return incident;

      if (!incident.priority && incidentPriority.includes('--')) return incident;
    });
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_PRIORITY_COMPLETED,
      incidents: filteredIncidentsByPriorityList,
    });
  } catch (e) {
    yield put({ type: FILTER_INCIDENTS_LIST_BY_PRIORITY_ERROR, message: e.message });
  }
}

export function* filterIncidentsByStatus() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_STATUS, filterIncidentsByStatusImpl);
}

export function* filterIncidentsByStatusImpl(action) {
  // Filter current incident list by status
  try {
    const { incidentStatus } = action;
    const { incidents } = yield select(selectIncidents);
    const filteredIncidentsByStatusList = filterIncidentsByField(incidents, 'status', incidentStatus);
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_STATUS_COMPLETED,
      incidents: filteredIncidentsByStatusList,
    });
  } catch (e) {
    yield put({ type: FILTER_INCIDENTS_LIST_BY_STATUS_ERROR, message: e.message });
  }
}

export function* filterIncidentsByUrgency() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_URGENCY, filterIncidentsByUrgencyImpl);
}

export function* filterIncidentsByUrgencyImpl(action) {
  // Filter current incident list by urgency
  try {
    const { incidentUrgency } = action;
    const { incidents } = yield select(selectIncidents);
    const filteredIncidentsByUrgencyList = filterIncidentsByField(
      incidents,
      'urgency',
      incidentUrgency,
    );
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_URGENCY_COMPLETED,
      incidents: filteredIncidentsByUrgencyList,
    });
  } catch (e) {
    yield put({ type: FILTER_INCIDENTS_LIST_BY_URGENCY_ERROR, message: e.message });
  }
}

export function* filterIncidentsByTeam() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_TEAM, filterIncidentsByTeamImpl);
}

export function* filterIncidentsByTeamImpl(action) {
  // Filter current incident list by team - assume no team set means show everything
  try {
    const { teamIds } = action;
    const { incidents } = yield select(selectIncidents);
    let filteredIncidentsByTeamList;

    // Typically there is no filtered view by teams, so if empty, show all teams.
    // FIXME: If a team filter is enabled, we see the incident coming in, however removing the filter then doesn't display incidents (e.g. re-request API)
    if (teamIds.length) {
      filteredIncidentsByTeamList = filterIncidentsByFieldOfList(incidents, 'teams', 'id', teamIds);
    } else {
      filteredIncidentsByTeamList = [...incidents];
    }

    // console.log(filteredIncidentsByTeamList, teamIds)
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_TEAM_COMPLETED,
      incidents: filteredIncidentsByTeamList,
    });
  } catch (e) {
    yield put({ type: FILTER_INCIDENTS_LIST_BY_TEAM_ERROR, message: e.message });
  }
}

export function* filterIncidentsByService() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_SERVICE, filterIncidentsByServiceImpl);
}

export function* filterIncidentsByServiceImpl(action) {
  // Filter current incident list by service
  try {
    const { serviceIds } = action;
    const { incidents } = yield select(selectIncidents);
    let filteredIncidentsByServiceList;

    // Typically there is no filtered view by services, so if empty, show all services.
    // FIXME: A similar bug happens (e.g. teams filter) when removing services - could be something with log_entries
    if (serviceIds.length) {
      // console.log("Pre filter incidents", incidents)
      filteredIncidentsByServiceList = filterIncidentsByField(incidents, 'service.id', serviceIds);
    } else {
      filteredIncidentsByServiceList = [...incidents];
    }

    // console.log("Filtered", filteredIncidentsByServiceList);

    yield put({
      type: FILTER_INCIDENTS_LIST_BY_SERVICE_COMPLETED,
      incidents: filteredIncidentsByServiceList,
    });
  } catch (e) {
    yield put({ type: FILTER_INCIDENTS_LIST_BY_SERVICE_ERROR, message: e.message });
  }
}
