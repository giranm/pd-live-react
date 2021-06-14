/* eslint-disable array-callback-return */
import { put, call, select, takeLatest } from "redux-saga/effects";
import { api } from '@pagerduty/pdjs';

import {
  FETCH_INCIDENTS_REQUESTED,
  FETCH_INCIDENTS_COMPLETED,
  FETCH_INCIDENTS_ERROR,
  UPDATE_INCIDENTS_LIST,
  UPDATE_INCIDENTS_LIST_COMPLETED,
  UPDATE_INCIDENTS_LIST_ERROR
} from "./actions";

import { selectIncidents } from "./selectors";

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

export function* getIncidentsAsync() {
  yield takeLatest(FETCH_INCIDENTS_REQUESTED, getIncidents);
};

export function* getIncidents(action) {
  try {
    //  Create params and call pd lib
    let { since, until } = action;
    let params = {
      since: since.toISOString(),
      until: until.toISOString(),
      'include[]': 'first_trigger_log_entries',
      'statuses[]': ['triggered', 'acknowledged']
    };
    let response = yield call(pd.all, "incidents", { data: { ...params } });

    yield put({
      type: FETCH_INCIDENTS_COMPLETED,
      incidents: response.resource
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
    let updatedIncidentsList = [...incidents];

    // Add new incidents to list
    addList.map(addItem => {
      if (addItem.incident)
        updatedIncidentsList.push(addItem.incident)
    });

    // Update existing incidents within list
    updatedIncidentsList = updatedIncidentsList.map(existingIncident => {
      let updatedItem = updateList.find(updateItem => {
        if (updateItem.incident)
          return updateItem.incident.id === existingIncident.id
      });
      let updatedIncident = updatedItem ? updatedItem.incident : null;
      return updatedIncident ? { ...existingIncident, ...updatedIncident } : existingIncident;
    });

    // Remove incidents within list
    updatedIncidentsList = updatedIncidentsList.filter(existingIncident => {
      return !removeList.some(removeItem => {
        if (removeItem.incident)
          return removeItem.incident.id === existingIncident.id
      });
    });

    yield put({ type: UPDATE_INCIDENTS_LIST_COMPLETED, incidents: updatedIncidentsList });
  } catch (e) {
    yield put({ type: UPDATE_INCIDENTS_LIST_ERROR, message: e.message });
  }
};