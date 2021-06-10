import { combineReducers } from "redux";

import incidents from "./incidents/reducers";
import logEntries from "./log_entries/reducers";

export default combineReducers({
  incidents,
  logEntries
});