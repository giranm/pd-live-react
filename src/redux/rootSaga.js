import { all } from "redux-saga/effects";

import { getIncidentsAsync, updateIncidentsListAsync, filterIncidentsByPriority } from "./incidents/sagas";
import { getLogEntriesAsync, updateRecentLogEntriesAsync, cleanRecentLogEntriesAsync } from "./log_entries/sagas";
import { updateIncidentTableColumns } from "./incident_table/sagas";
import { getServicesAsync } from "./services/sagas";
import { getTeamsAsync } from "./teams/sagas";
import { getPrioritiesAsync } from "./priorities/sagas";
import {
  toggleDisplayQuerySettings,
  updateQuerySettingsSinceDate,
  updateQuerySettingsIncidentStatus,
  updateQuerySettingsIncidentUrgency,
  updateQuerySettingsIncidentPriority,
  updateQuerySettingsTeams,
  updateQuerySettingsServices
} from "./query_settings/sagas";


export default function* rootSaga() {
  yield all([
    getIncidentsAsync(),
    getLogEntriesAsync(),
    updateRecentLogEntriesAsync(),
    updateIncidentsListAsync(),
    filterIncidentsByPriority(),
    cleanRecentLogEntriesAsync(),
    toggleDisplayQuerySettings(),
    updateQuerySettingsSinceDate(),
    updateQuerySettingsIncidentStatus(),
    updateQuerySettingsIncidentUrgency(),
    updateQuerySettingsIncidentPriority(),
    updateQuerySettingsTeams(),
    updateQuerySettingsServices(),
    updateIncidentTableColumns(),
    getServicesAsync(),
    getTeamsAsync(),
    getPrioritiesAsync(),
  ]);
};