import { all } from "redux-saga/effects";

import {
  toggleDisplayQuerySettings,
  updateQuerySettingsSinceDate,
  updateQuerySettingsIncidentStatus,
  updateQuerySettingsIncidentUrgency,
  updateQuerySettingsIncidentPriority,
  updateQuerySettingsTeams,
  updateQuerySettingsServices
} from "./query_settings/sagas";

import {
  getIncidentsAsync,
  updateIncidentsListAsync,
  filterIncidentsByPriority,
  filterIncidentsByStatus,
  filterIncidentsByUrgency,
  filterIncidentsByTeam,
} from "./incidents/sagas";

import {
  getLogEntriesAsync,
  updateRecentLogEntriesAsync,
  cleanRecentLogEntriesAsync
} from "./log_entries/sagas";

import {
  toggleIncidentTableSettings,
  saveIncidentTableSettings,
  updateIncidentTableColumns,
  selectIncidentTableRows,
} from "./incident_table/sagas";

import {
  acknowledgeAsync,
} from "./incident_actions/sagas";

import {
  toggleActionAlertsModal,
  updateActionAlertsModal,
} from "./action_alerts/sagas";

import {
  getCurrentUserAsync
} from "./users/sagas";

import { getServicesAsync } from "./services/sagas";
import { getTeamsAsync } from "./teams/sagas";
import { getPrioritiesAsync } from "./priorities/sagas";

export default function* rootSaga() {
  yield all([
    // Query Settings
    toggleDisplayQuerySettings(),
    updateQuerySettingsSinceDate(),
    updateQuerySettingsIncidentStatus(),
    updateQuerySettingsIncidentUrgency(),
    updateQuerySettingsIncidentPriority(),
    updateQuerySettingsTeams(),
    updateQuerySettingsServices(),

    // Incidents
    getIncidentsAsync(),
    updateIncidentsListAsync(),
    filterIncidentsByPriority(),
    filterIncidentsByStatus(),
    filterIncidentsByUrgency(),
    filterIncidentsByTeam(),

    // Log Entries
    getLogEntriesAsync(),
    updateRecentLogEntriesAsync(),
    cleanRecentLogEntriesAsync(),

    // Incident Table
    toggleIncidentTableSettings(),
    saveIncidentTableSettings(),
    updateIncidentTableColumns(),
    selectIncidentTableRows(),

    // Incident Actions
    acknowledgeAsync(),

    // Action Alerts Modal
    toggleActionAlertsModal(),
    updateActionAlertsModal(),

    // Users
    getCurrentUserAsync(),

    // Services
    getServicesAsync(),

    // Teams
    getTeamsAsync(),

    // Priorities
    getPrioritiesAsync(),
  ]);
};