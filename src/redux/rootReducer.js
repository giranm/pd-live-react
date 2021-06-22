import { combineReducers } from "redux";

import incidents from "./incidents/reducers";
import logEntries from "./log_entries/reducers";
import querySettings from "./query_settings/reducers";
import { incidentTableSettings, tempIncidentTableSettings } from "./incident_table/reducers";
import services from "./services/reducers";
import teams from "./teams/reducers";
import priorities from "./priorities/reducers";

export default combineReducers({
  incidents,
  logEntries,
  querySettings,
  incidentTableSettings,
  tempIncidentTableSettings,
  services,
  teams,
  priorities
});