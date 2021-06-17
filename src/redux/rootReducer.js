import { combineReducers } from "redux";

import incidents from "./incidents/reducers";
import logEntries from "./log_entries/reducers";
import querySettings from "./query_settings/reducers";
import incidentTableSettings from "./incident_table/reducers";


export default combineReducers({
  incidents,
  logEntries,
  querySettings,
  incidentTableSettings
});