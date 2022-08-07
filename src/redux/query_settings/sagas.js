import {
  put, select, takeLatest, call, debounce,
} from 'redux-saga/effects';

import {
  pd,
} from 'util/pd-api-wrapper';

import selectSettings from 'redux/settings/selectors';

import {
  UPDATE_CONNECTION_STATUS_REQUESTED,
} from 'redux/connection/actions';
import {
  FETCH_INCIDENTS_REQUESTED,
  FILTER_INCIDENTS_LIST_BY_QUERY,
  FETCH_ALL_INCIDENT_NOTES_REQUESTED,
  FETCH_ALL_INCIDENT_ALERTS_REQUESTED,
} from 'redux/incidents/actions';
import {
  FETCH_SERVICES_REQUESTED,
} from 'redux/services/actions';
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

import selectQuerySettings from './selectors';

export function* toggleDisplayQuerySettings() {
  yield takeLatest(TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED, toggleDisplayQuerySettingsImpl);
}

export function* toggleDisplayQuerySettingsImpl() {
  const {
    displayQuerySettings,
  } = yield select(selectQuerySettings);
  yield put({
    type: TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED,
    displayQuerySettings: !displayQuerySettings,
  });
}

export function* updateQuerySettingsSinceDate() {
  yield takeLatest(UPDATE_QUERY_SETTING_SINCE_DATE_REQUESTED, updateQuerySettingsSinceDateImpl);
}

export function* updateQuerySettingsSinceDateImpl(action) {
  // Update since date and re-request incidents list + notes
  const {
    sinceDate,
  } = action;
  yield put({ type: UPDATE_QUERY_SETTING_SINCE_DATE_COMPLETED, sinceDate });
  yield put({ type: VALIDATE_INCIDENT_QUERY_REQUESTED });
}

export function* updateQuerySettingsIncidentStatus() {
  yield takeLatest(
    UPDATE_QUERY_SETTING_INCIDENT_STATUS_REQUESTED,
    updateQuerySettingsIncidentStatusImpl,
  );
}

export function* updateQuerySettingsIncidentStatusImpl(action) {
  // Update incident status and re-request incidents list + notes
  const {
    incidentStatus,
  } = action;
  yield put({
    type: UPDATE_QUERY_SETTING_INCIDENT_STATUS_COMPLETED,
    incidentStatus,
  });
  yield put({ type: VALIDATE_INCIDENT_QUERY_REQUESTED });
}

export function* updateQuerySettingsIncidentUrgency() {
  yield takeLatest(
    UPDATE_QUERY_SETTING_INCIDENT_URGENCY_REQUESTED,
    updateQuerySettingsIncidentUrgencyImpl,
  );
}

export function* updateQuerySettingsIncidentUrgencyImpl(action) {
  // Update incident urgency and re-request incidents list + notes
  const {
    incidentUrgency,
  } = action;
  yield put({
    type: UPDATE_QUERY_SETTING_INCIDENT_URGENCY_COMPLETED,
    incidentUrgency,
  });
  yield put({ type: VALIDATE_INCIDENT_QUERY_REQUESTED });
}

export function* updateQuerySettingsIncidentPriority() {
  yield takeLatest(
    UPDATE_QUERY_SETTING_INCIDENT_PRIORITY_REQUESTED,
    updateQuerySettingsIncidentPriorityImpl,
  );
}

export function* updateQuerySettingsIncidentPriorityImpl(action) {
  // Update incident priority, re-request incidents list, and then apply priority filtering
  const {
    incidentPriority,
  } = action;
  yield put({
    type: UPDATE_QUERY_SETTING_INCIDENT_PRIORITY_COMPLETED,
    incidentPriority,
  });
  yield put({ type: VALIDATE_INCIDENT_QUERY_REQUESTED });
}

export function* updateQuerySettingsTeams() {
  yield takeLatest(UPDATE_QUERY_SETTINGS_TEAMS_REQUESTED, updateQuerySettingsTeamsImpl);
}

export function* updateQuerySettingsTeamsImpl(action) {
  // Update team ids, re-request services under those teams, and re-request incidents list
  const {
    teamIds,
  } = action;
  yield put({ type: FETCH_SERVICES_REQUESTED, teamIds });
  yield put({ type: UPDATE_QUERY_SETTINGS_TEAMS_COMPLETED, teamIds });
  yield put({ type: VALIDATE_INCIDENT_QUERY_REQUESTED });
}

export function* updateQuerySettingsServices() {
  yield takeLatest(UPDATE_QUERY_SETTINGS_SERVICES_REQUESTED, updateQuerySettingsServicesImpl);
}

export function* updateQuerySettingsServicesImpl(action) {
  // Update service ids and re-request incidents list + notes
  const {
    serviceIds,
  } = action;
  yield put({ type: UPDATE_QUERY_SETTINGS_SERVICES_COMPLETED, serviceIds });
  yield put({ type: VALIDATE_INCIDENT_QUERY_REQUESTED });
}

export function* updateSearchQuery() {
  yield takeLatest(UPDATE_SEARCH_QUERY_REQUESTED, updateSearchQueryImpl);
}

export function* updateSearchQueryImpl(action) {
  // Update search query and filter incidents
  const {
    searchQuery,
  } = action;
  yield put({ type: UPDATE_SEARCH_QUERY_COMPLETED, searchQuery });
  yield put({ type: FILTER_INCIDENTS_LIST_BY_QUERY, searchQuery });
}

export function* validateIncidentQuery() {
  yield debounce(2000, VALIDATE_INCIDENT_QUERY_REQUESTED, validateIncidentQueryImpl);
}

export function* validateIncidentQueryImpl() {
  try {
    // Find total incidents from data query
    const {
      maxIncidentsLimit, autoAcceptIncidentsQuery,
    } = yield select(selectSettings);

    const {
      sinceDate,
      incidentStatus,
      incidentUrgency,
      teamIds,
      serviceIds,
      // incidentPriority, // Unfortunately can't do this pre-API call.
    } = yield select(selectQuerySettings);

    const params = {
      since: sinceDate.toISOString(),
      until: new Date().toISOString(),
      limit: 1,
      total: true,
    };

    if (incidentStatus) params['statuses[]'] = incidentStatus;
    if (incidentUrgency) params['urgencies[]'] = incidentUrgency;
    if (teamIds.length) params['team_ids[]'] = teamIds;
    if (serviceIds.length) params['service_ids[]'] = serviceIds;

    const response = yield call(pd.get, 'incidents', { data: { ...params } });
    if (response.status !== 200) {
      throw Error('Unable to fetch incidents');
    }

    const totalIncidentsFromQuery = response.data.total;
    yield put({ type: VALIDATE_INCIDENT_QUERY_COMPLETED });
    yield put({
      type: UPDATE_TOTAL_INCIDENTS_FROM_QUERY_REQUESTED,
      totalIncidentsFromQuery,
    });

    // Determine if Confirm Query Modal component should be rendered
    if (totalIncidentsFromQuery > maxIncidentsLimit && !autoAcceptIncidentsQuery) {
      yield put({ type: TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_REQUESTED });
    } else {
      yield put({ type: CONFIRM_INCIDENT_QUERY_REQUESTED, confirm: true });
    }
  } catch (e) {
    // Handle API auth failure
    if (e.status === 401) {
      e.message = 'Unauthorized Access';
    }
    yield put({
      type: UPDATE_CONNECTION_STATUS_REQUESTED,
      connectionStatus: 'neutral',
      connectionStatusMessage: e.message,
    });
  }
}

export function* toggleDisplayConfirmQueryModal() {
  yield takeLatest(
    TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_REQUESTED,
    toggleDisplayConfirmQueryModalImpl,
  );
}

export function* toggleDisplayConfirmQueryModalImpl() {
  const {
    displayConfirmQueryModal,
  } = yield select(selectQuerySettings);
  yield put({
    type: TOGGLE_DISPLAY_CONFIRM_QUERY_MODAL_COMPLETED,
    displayConfirmQueryModal: !displayConfirmQueryModal,
  });
}

export function* updateTotalIncidentsFromQuery() {
  yield takeLatest(UPDATE_TOTAL_INCIDENTS_FROM_QUERY_REQUESTED, updateTotalIncidentsFromQueryImpl);
}

export function* updateTotalIncidentsFromQueryImpl(action) {
  const {
    totalIncidentsFromQuery,
  } = action;
  yield put({
    type: UPDATE_TOTAL_INCIDENTS_FROM_QUERY_COMPLETED,
    totalIncidentsFromQuery,
  });
}

export function* confirmIncidentQuery() {
  yield takeLatest(CONFIRM_INCIDENT_QUERY_REQUESTED, confirmIncidentQueryImpl);
}

export function* confirmIncidentQueryImpl(action) {
  const {
    confirm,
  } = action;
  if (confirm) {
    yield put({ type: FETCH_INCIDENTS_REQUESTED });
    yield put({ type: FETCH_ALL_INCIDENT_NOTES_REQUESTED });
    yield put({ type: FETCH_ALL_INCIDENT_ALERTS_REQUESTED });
    yield put({ type: CONFIRM_INCIDENT_QUERY_COMPLETED });
  } else {
    yield put({ type: CONFIRM_INCIDENT_QUERY_ERROR });
  }
}
