import produce from "immer";
import moment from "moment";

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
  UPDATE_QUERY_SETTINGS_TEAMS_COMPLETED
} from "./actions";

import {
  TRIGGERED,
  ACKNOWLEDGED,
  RESOLVED,
  HIGH,
  LOW,
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

      case UPDATE_QUERY_SETTING_INCIDENT_URGENCY_REQUESTED:
        draft.status = UPDATE_QUERY_SETTING_INCIDENT_URGENCY_REQUESTED;
        break;

      case UPDATE_QUERY_SETTING_INCIDENT_URGENCY_COMPLETED:
        draft.incidentUrgency = action.incidentUrgency;
        draft.status = UPDATE_QUERY_SETTING_INCIDENT_URGENCY_COMPLETED;
        break;

      // TODO: Insert logic for priorities
      case UPDATE_QUERY_SETTINGS_TEAMS_REQUESTED:
        draft.status = UPDATE_QUERY_SETTINGS_TEAMS_REQUESTED;
        break;

      case UPDATE_QUERY_SETTINGS_TEAMS_COMPLETED:
        draft.teamIds = action.teamIds;
        draft.status = UPDATE_QUERY_SETTINGS_TEAMS_COMPLETED;
        break;

      default:
        break;
    }
  },
  {
    displayQuerySettings: true,
    sinceDate: moment().subtract(1, "days").toDate(),
    untilDate: new Date(),
    incidentStatus: [TRIGGERED, ACKNOWLEDGED],
    incidentUrgency: [HIGH, LOW],
    teamIds: [],
    status: null,
    fetchingData: false,
    error: null
  }
);

export default querySettings;