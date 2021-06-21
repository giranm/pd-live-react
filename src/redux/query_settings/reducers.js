import produce from "immer";
import moment from "moment";

import {
  TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED,
  TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED,
  UPDATE_QUERY_SETTING_SINCE_DATE_REQUESTED,
  UPDATE_QUERY_SETTING_SINCE_DATE_COMPLETED,
  UPDATE_QUERY_SETTING_INCIDENT_STATUS_REQUESTED,
  UPDATE_QUERY_SETTING_INCIDENT_STATUS_COMPLETED
} from "./actions";

import {
  TRIGGERED,
  ACKNOWLEDGED,
  RESOLVED
} from "util/incidents";

const querySettings = produce(
  (draft, action) => {
    switch (action.type) {
      case TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED:
        draft.status = TOGGLE_DISPLAY_QUERY_SETTINGS_REQUESTED;
        break;

      case TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED:
        draft.displayQuerySettings = action.displayQuerySettings;
        draft.status = TOGGLE_DISPLAY_QUERY_SETTINGS_COMPLETED;
        break;

      case UPDATE_QUERY_SETTING_SINCE_DATE_REQUESTED:
        draft.status = UPDATE_QUERY_SETTING_SINCE_DATE_REQUESTED;
        break;

      case UPDATE_QUERY_SETTING_SINCE_DATE_COMPLETED:
        draft.sinceDate = action.sinceDate;
        draft.status = UPDATE_QUERY_SETTING_SINCE_DATE_COMPLETED;
        break;

      case UPDATE_QUERY_SETTING_INCIDENT_STATUS_REQUESTED:
        draft.status = UPDATE_QUERY_SETTING_INCIDENT_STATUS_REQUESTED;
        break;

      case UPDATE_QUERY_SETTING_INCIDENT_STATUS_COMPLETED:
        draft.incidentStatus = action.incidentStatus;
        draft.status = UPDATE_QUERY_SETTING_INCIDENT_STATUS_COMPLETED;
        break;

      // TODO: Insert further actions for status, urgency, etc
      default:
        break;
    }
  },
  {
    displayQuerySettings: true,
    sinceDate: moment().subtract(1, "days").toDate(),
    untilDate: new Date(),
    incidentStatus: [TRIGGERED, ACKNOWLEDGED],
    status: null,
    fetchingData: false,
    error: null
  }
);

export default querySettings;