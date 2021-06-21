import { all } from "redux-saga/effects";

import { getIncidentsAsync, updateIncidentsListAsync } from "./incidents/sagas";
import { getLogEntriesAsync, updateRecentLogEntriesAsync, cleanRecentLogEntriesAsync } from "./log_entries/sagas";
import { updateIncidentTableColumns } from "./incident_table/sagas";
import { getServicesAsync } from "./services/sagas";
import { getTeamsAsync } from "./teams/sagas";
import { getPrioritiesAsync } from "./priorities/sagas";
import {
  toggleDisplayQuerySettings,
  updateQuerySettingsSinceDate,
  updateQuerySettingsIncidentStatus
} from "./query_settings/sagas";


export default function* rootSaga() {
  yield all([
    getIncidentsAsync(),
    getLogEntriesAsync(),
    updateRecentLogEntriesAsync(),
    updateIncidentsListAsync(),
    cleanRecentLogEntriesAsync(),
    toggleDisplayQuerySettings(),
    updateQuerySettingsSinceDate(),
    updateQuerySettingsIncidentStatus(),
    updateIncidentTableColumns(),
    getServicesAsync(),
    getTeamsAsync(),
    getPrioritiesAsync(),
  ]);
};