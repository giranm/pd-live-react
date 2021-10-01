import { combineReducers } from "redux";

import actionAlertsModalData from "./action_alerts/reducers";
import incidents from "./incidents/reducers";
import logEntries from "./log_entries/reducers";
import querySettings from "./query_settings/reducers";
import incidentTableSettings from "./incident_table/reducers";
import incidentActions from "./incident_actions/reducers";
import services from "./services/reducers";
import teams from "./teams/reducers";
import priorities from "./priorities/reducers";
import users from "./users/reducers";
import escalationPolicies from "./escalation_policies/reducers";
import extensions from "./extensions/reducers";

export default combineReducers({
  actionAlertsModalData,
  incidents,
  logEntries,
  querySettings,
  incidentTableSettings,
  incidentActions,
  services,
  teams,
  priorities,
  users,
  escalationPolicies,
  extensions
});