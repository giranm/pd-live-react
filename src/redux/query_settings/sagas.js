import { put, select, takeLatest } from 'redux-saga/effects';

import { FETCH_INCIDENTS_REQUESTED, FILTER_INCIDENTS_LIST_BY_QUERY } from 'redux/incidents/actions';
import { FETCH_SERVICES_REQUESTED } from 'redux/services/actions';
import {
  TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED,
  TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED,
  UPDATE_QUERY_SETTING_SINCE_DATE_REQUESTED,
  UPDATE_QUERY_SETTING_SINCE_DATE_COMPLETED,
  UPDATE_QUERY_SETTING_INCIDENT_STATUS_REQUESTED,
  UPDATE_QUERY_SETTING_INCIDENT_STATUS_COMPLETED,
  UPDATE_QUERY_SETTING_INCIDENT_URGENCY_REQUESTED,
  UPDATE_QUERY_SETTING_INCIDENT_URGENCY_COMPLETED,
  UPDATE_QUERY_SETTING_INCIDENT_PRIORITY_REQUESTED,
  UPDATE_QUERY_SETTING_INCIDENT_PRIORITY_COMPLETED,
  UPDATE_QUERY_SETTINGS_TEAMS_REQUESTED,
  UPDATE_QUERY_SETTINGS_TEAMS_COMPLETED,
  UPDATE_QUERY_SETTINGS_SERVICES_REQUESTED,
  UPDATE_QUERY_SETTINGS_SERVICES_COMPLETED,
  UPDATE_SEARCH_QUERY_REQUESTED,
  UPDATE_SEARCH_QUERY_COMPLETED,
} from './actions';

import selectQuerySettings from './selectors';

export function* toggleDisplayQuerySettings() {
  yield takeLatest(TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED, toggleDisplayQuerySettingsImpl);
}

export function* toggleDisplayQuerySettingsImpl() {
  const { displayQuerySettings } = yield select(selectQuerySettings);
  yield put({
    type: TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED,
    displayQuerySettings: !displayQuerySettings,
  });
}

export function* updateQuerySettingsSinceDate() {
  yield takeLatest(UPDATE_QUERY_SETTING_SINCE_DATE_REQUESTED, updateQuerySettingsSinceDateImpl);
}

export function* updateQuerySettingsSinceDateImpl(action) {
  // Update since date and re-request incidents list
  const { sinceDate } = action;
  yield put({ type: UPDATE_QUERY_SETTING_SINCE_DATE_COMPLETED, sinceDate });
  yield put({ type: FETCH_INCIDENTS_REQUESTED });
}

export function* updateQuerySettingsIncidentStatus() {
  yield takeLatest(
    UPDATE_QUERY_SETTING_INCIDENT_STATUS_REQUESTED,
    updateQuerySettingsIncidentStatusImpl,
  );
}

export function* updateQuerySettingsIncidentStatusImpl(action) {
  // Update incident status and re-request incidents list
  const { incidentStatus } = action;
  yield put({
    type: UPDATE_QUERY_SETTING_INCIDENT_STATUS_COMPLETED,
    incidentStatus,
  });
  yield put({ type: FETCH_INCIDENTS_REQUESTED });
}

export function* updateQuerySettingsIncidentUrgency() {
  yield takeLatest(
    UPDATE_QUERY_SETTING_INCIDENT_URGENCY_REQUESTED,
    updateQuerySettingsIncidentUrgencyImpl,
  );
}

export function* updateQuerySettingsIncidentUrgencyImpl(action) {
  // Update incident urgency and re-request incidents list
  const { incidentUrgency } = action;
  yield put({
    type: UPDATE_QUERY_SETTING_INCIDENT_URGENCY_COMPLETED,
    incidentUrgency,
  });
  yield put({ type: FETCH_INCIDENTS_REQUESTED });
}

export function* updateQuerySettingsIncidentPriority() {
  yield takeLatest(
    UPDATE_QUERY_SETTING_INCIDENT_PRIORITY_REQUESTED,
    updateQuerySettingsIncidentPriorityImpl,
  );
}

export function* updateQuerySettingsIncidentPriorityImpl(action) {
  // Update incident priority, re-request incidents list, and then apply priority filtering
  const { incidentPriority } = action;
  yield put({
    type: UPDATE_QUERY_SETTING_INCIDENT_PRIORITY_COMPLETED,
    incidentPriority,
  });
  yield put({ type: FETCH_INCIDENTS_REQUESTED });
}

export function* updateQuerySettingsTeams() {
  yield takeLatest(UPDATE_QUERY_SETTINGS_TEAMS_REQUESTED, updateQuerySettingsTeamsImpl);
}

export function* updateQuerySettingsTeamsImpl(action) {
  // Update team ids, re-request services under those teams, and re-request incidents list
  const { teamIds } = action;
  yield put({ type: FETCH_SERVICES_REQUESTED, teamIds });
  yield put({ type: UPDATE_QUERY_SETTINGS_TEAMS_COMPLETED, teamIds });
  yield put({ type: FETCH_INCIDENTS_REQUESTED });
}

export function* updateQuerySettingsServices() {
  yield takeLatest(UPDATE_QUERY_SETTINGS_SERVICES_REQUESTED, updateQuerySettingsServicesImpl);
}

export function* updateQuerySettingsServicesImpl(action) {
  // Update service ids and re-request incidents list
  const { serviceIds } = action;
  yield put({ type: UPDATE_QUERY_SETTINGS_SERVICES_COMPLETED, serviceIds });
  yield put({ type: FETCH_INCIDENTS_REQUESTED });
}

export function* updateSearchQuery() {
  yield takeLatest(UPDATE_SEARCH_QUERY_REQUESTED, updateSearchQueryImpl);
}

export function* updateSearchQueryImpl(action) {
  // Update search query and filter incidents
  const { searchQuery } = action;
  yield put({ type: UPDATE_SEARCH_QUERY_COMPLETED, searchQuery });
  yield put({ type: FILTER_INCIDENTS_LIST_BY_QUERY, searchQuery });
}
