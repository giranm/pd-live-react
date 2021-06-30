/* eslint-disable array-callback-return */
import { put, call, select, takeLatest } from "redux-saga/effects";
import { api } from '@pagerduty/pdjs';

import {
  FETCH_INCIDENTS_REQUESTED,
  FETCH_INCIDENTS_COMPLETED,
  FETCH_INCIDENTS_ERROR,
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
  FILTER_INCIDENTS_LIST_BY_TEAM_ERROR
} from "./actions";

import { selectIncidents } from "./selectors";
import { selectQuerySettings } from "redux/query_settings/selectors";

import { pushToArray } from "util/helpers";
import { filterIncidentsByField, filterIncidentsByFieldOfList } from "util/incidents";

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

export function* getIncidentsAsync() {
  yield takeLatest(FETCH_INCIDENTS_REQUESTED, getIncidents);
};

export function* getIncidents(action) {
  try {
    //  Build params from query settings and call pd lib
    let {
      sinceDate,
      untilDate,
      incidentStatus,
      incidentUrgency,
      teamIds,
      serviceIds,
      incidentPriority
    } = yield select(selectQuerySettings);

    let params = {
      since: sinceDate.toISOString(),
      until: untilDate.toISOString(),
      'include[]': 'first_trigger_log_entries',
    };

    // TODO: Insert queries for services
    if (incidentStatus)
      params["statuses[]"] = incidentStatus;

    if (incidentUrgency)
      params["urgencies[]"] = incidentUrgency;

    if (teamIds.length)
      params["team_ids[]"] = teamIds;

    if (serviceIds.length)
      params["service_ids[]"] = serviceIds;

    let response = yield call(pd.all, "incidents", { data: { ...params } });

    yield put({
      type: FETCH_INCIDENTS_COMPLETED,
      incidents: response.resource
    });

    // Filter incident list on priority (can't do this from API)
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_PRIORITY,
      incidentPriority
    });

  } catch (e) {
    yield put({ type: FETCH_INCIDENTS_ERROR, message: e.message });
  }
};

export function* updateIncidentsListAsync() {
  yield takeLatest(UPDATE_INCIDENTS_LIST, updateIncidentsList);
};

export function* updateIncidentsList(action) {
  try {
    let { addList, updateList, removeList } = action;
    let { incidents } = yield select(selectIncidents);
    let {
      incidentPriority,
      incidentStatus,
      incidentUrgency,
      teamIds,
    } = yield select(selectQuerySettings);
    let updatedIncidentsList = [...incidents];

    // Add new incidents to list
    addList.map(addItem => {
      if (addItem.incident)
        updatedIncidentsList.push(addItem.incident)
    });

    // Update existing incidents within list
    if (incidents.length && updateList.length) {
      updatedIncidentsList = updatedIncidentsList.map(existingIncident => {
        let updatedItem = updateList.find(updateItem => {
          if (updateItem.incident)
            return updateItem.incident.id === existingIncident.id
        });
        let updatedIncident = updatedItem ? updatedItem.incident : null;
        return updatedIncident ? { ...existingIncident, ...updatedIncident } : existingIncident;
      });
    }

    // Handle cases where new updates come in against an empty incident list or filtered out incidents
    if (updateList.length) {
      updateList.map(updateItem => {
        if (updateItem.incident) {
          // Check if item is matched against updatedIncidentsList (skip)
          if (updatedIncidentsList.find((incident) => incident.id === updateItem.incident.id))
            return;

          // Update incident list (push if we haven't updated already)
          pushToArray(updatedIncidentsList, updateItem.incident, "id");
        };
      });
    };

    // Remove incidents within list
    updatedIncidentsList = updatedIncidentsList.filter(existingIncident => {
      return !removeList.some(removeItem => {
        if (removeItem.incident)
          return removeItem.incident.id === existingIncident.id
      });
    });

    // Update store with updated list of incidents
    yield put({ type: UPDATE_INCIDENTS_LIST_COMPLETED, incidents: updatedIncidentsList });

    /* 
      Apply filters that already are configured down below
    */

    // Filter updated incident list on priority (can't do this from API)
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_PRIORITY,
      incidentPriority
    });

    // Filter updated incident list on status
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_STATUS,
      incidentStatus
    });

    // Filter updated incident list on urgency
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_URGENCY,
      incidentUrgency
    });

    // Filter updated incident list on team
    yield put({
      type: FILTER_INCIDENTS_LIST_BY_TEAM,
      teamIds
    });

  } catch (e) {
    yield put({ type: UPDATE_INCIDENTS_LIST_ERROR, message: e.message });
  }
};

export function* filterIncidentsByPriority() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_PRIORITY, filterIncidentsByPriorityImpl);
};

export function* filterIncidentsByPriorityImpl(action) {
  // Filter current incident list by priority
  try {
    let { incidentPriority } = action;
    let { incidents } = yield select(selectIncidents);
    let filteredIncidentsByPriorityList = incidents.filter(
      (incident) => {
        // Incident priority is not always defined - need to check this
        if (incident.priority && incidentPriority.includes(incident.priority.id))
          return incident

        if (!incident.priority && incidentPriority.includes("--"))
          return incident
      }
    );
    yield put({ type: FILTER_INCIDENTS_LIST_BY_PRIORITY_COMPLETED, incidents: filteredIncidentsByPriorityList });
  } catch (e) {
    yield put({ type: FILTER_INCIDENTS_LIST_BY_PRIORITY_ERROR, message: e.message });
  }

};

export function* filterIncidentsByStatus() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_STATUS, filterIncidentsByStatusImpl);
};

export function* filterIncidentsByStatusImpl(action) {
  // Filter current incident list by status
  try {
    let { incidentStatus } = action;
    let { incidents } = yield select(selectIncidents);
    let filteredIncidentsByStatusList = filterIncidentsByField(incidents, "status", incidentStatus)
    yield put({ type: FILTER_INCIDENTS_LIST_BY_STATUS_COMPLETED, incidents: filteredIncidentsByStatusList });
  } catch (e) {
    yield put({ type: FILTER_INCIDENTS_LIST_BY_STATUS_ERROR, message: e.message });
  }

};

export function* filterIncidentsByUrgency() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_URGENCY, filterIncidentsByUrgencyImpl);
};

export function* filterIncidentsByUrgencyImpl(action) {
  // Filter current incident list by urgency
  try {
    let { incidentUrgency } = action;
    let { incidents } = yield select(selectIncidents);
    let filteredIncidentsByUrgencyList = filterIncidentsByField(incidents, "urgency", incidentUrgency)
    yield put({ type: FILTER_INCIDENTS_LIST_BY_URGENCY_COMPLETED, incidents: filteredIncidentsByUrgencyList });
  } catch (e) {
    yield put({ type: FILTER_INCIDENTS_LIST_BY_URGENCY_ERROR, message: e.message });
  }

};

export function* filterIncidentsByTeam() {
  yield takeLatest(FILTER_INCIDENTS_LIST_BY_TEAM, filterIncidentsByTeamImpl);
};

export function* filterIncidentsByTeamImpl(action) {
  // Filter current incident list by team - assume no team set means show everything
  try {
    let { teamIds } = action;
    let { incidents } = yield select(selectIncidents);
    let filteredIncidentsByTeamList;

    // Typically there is no filtered view by teams, so if empty, show all teams.
    // FIXME: If a team filter is enabled, we see the incident coming in, however removing the filter then doesn't display incidents (e.g. re-request API)
    if (teamIds.length) {
      filteredIncidentsByTeamList = filterIncidentsByFieldOfList(incidents, "teams", "id", teamIds);
    } else {
      filteredIncidentsByTeamList = [...incidents];
    }

    // console.log(filteredIncidentsByTeamList, teamIds)
    yield put({ type: FILTER_INCIDENTS_LIST_BY_TEAM_COMPLETED, incidents: filteredIncidentsByTeamList });
  } catch (e) {
    yield put({ type: FILTER_INCIDENTS_LIST_BY_TEAM_ERROR, message: e.message });
  }

};