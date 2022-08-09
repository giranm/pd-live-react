import produce from 'immer';

import {
  UPDATE_INCIDENT_REDUCER_STATUS,
} from 'util/incidents';

import {
  FETCH_INCIDENTS_REQUESTED,
  FETCH_INCIDENTS_COMPLETED,
  FETCH_INCIDENTS_ERROR,
  REFRESH_INCIDENTS_REQUESTED,
  REFRESH_INCIDENTS_COMPLETED,
  REFRESH_INCIDENTS_ERROR,
  FETCH_INCIDENT_NOTES_REQUESTED,
  FETCH_INCIDENT_NOTES_COMPLETED,
  FETCH_INCIDENT_NOTES_ERROR,
  FETCH_ALL_INCIDENT_NOTES_REQUESTED,
  FETCH_ALL_INCIDENT_NOTES_COMPLETED,
  FETCH_ALL_INCIDENT_NOTES_ERROR,
  FETCH_ALL_INCIDENT_ALERTS_REQUESTED,
  FETCH_ALL_INCIDENT_ALERTS_COMPLETED,
  FETCH_ALL_INCIDENT_ALERTS_ERROR,
  UPDATE_INCIDENTS_LIST,
  UPDATE_INCIDENTS_LIST_COMPLETED,
  UPDATE_INCIDENTS_LIST_ERROR,
  FILTER_INCIDENTS_LIST_BY_PRIORITY,
  FILTER_INCIDENTS_LIST_BY_PRIORITY_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_PRIORITY_ERROR,
  FILTER_INCIDENTS_LIST_BY_STATUS,
  FILTER_INCIDENTS_LIST_BY_STATUS_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_STATUS_ERROR,
  FILTER_INCIDENTS_LIST_BY_URGENCY,
  FILTER_INCIDENTS_LIST_BY_URGENCY_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_URGENCY_ERROR,
  FILTER_INCIDENTS_LIST_BY_TEAM,
  FILTER_INCIDENTS_LIST_BY_TEAM_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_TEAM_ERROR,
  FILTER_INCIDENTS_LIST_BY_SERVICE,
  FILTER_INCIDENTS_LIST_BY_SERVICE_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_SERVICE_ERROR,
  FILTER_INCIDENTS_LIST_BY_QUERY,
  FILTER_INCIDENTS_LIST_BY_QUERY_COMPLETED,
  FILTER_INCIDENTS_LIST_BY_QUERY_ERROR,
} from './actions';

const incidents = produce(
  (draft, action) => {
    switch (action.type) {
      case FETCH_INCIDENTS_REQUESTED:
        draft.fetchingIncidents = true;
        draft.status = FETCH_INCIDENTS_REQUESTED;
        break;

      case FETCH_INCIDENTS_COMPLETED:
        draft.fetchingIncidents = false;
        draft.status = FETCH_INCIDENTS_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case FETCH_INCIDENTS_ERROR:
        draft.fetchingIncidents = false;
        draft.status = FETCH_INCIDENTS_ERROR;
        draft.error = action.message;
        break;

      case REFRESH_INCIDENTS_REQUESTED:
        draft.refreshingIncidents = true;
        draft.status = REFRESH_INCIDENTS_REQUESTED;
        break;

      case REFRESH_INCIDENTS_COMPLETED:
        draft.refreshingIncidents = false;
        draft.status = REFRESH_INCIDENTS_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case REFRESH_INCIDENTS_ERROR:
        draft.refreshingIncidents = false;
        draft.status = REFRESH_INCIDENTS_ERROR;
        draft.error = action.message;
        break;

      case FETCH_INCIDENT_NOTES_REQUESTED:
        draft.fetchingData = true;
        draft.fetchingIncidentNotes = true;
        draft.status = FETCH_INCIDENT_NOTES_REQUESTED;
        draft.incidentId = action.incidentId;
        break;

      case FETCH_INCIDENT_NOTES_COMPLETED:
        draft.fetchingData = false;
        draft.fetchingIncidentNotes = false;
        draft.status = FETCH_INCIDENT_NOTES_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case FETCH_INCIDENT_NOTES_ERROR:
        draft.fetchingData = false;
        draft.fetchingIncidentNotes = false;
        draft.status = FETCH_INCIDENT_NOTES_ERROR;
        draft.error = action.message;
        break;

      case FETCH_ALL_INCIDENT_NOTES_REQUESTED:
        draft.fetchingData = true;
        draft.fetchingIncidentNotes = true;
        draft.status = FETCH_ALL_INCIDENT_NOTES_REQUESTED;
        break;

      case FETCH_ALL_INCIDENT_NOTES_COMPLETED:
        draft.fetchingData = false;
        draft.fetchingIncidentNotes = false;
        draft.status = FETCH_ALL_INCIDENT_NOTES_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case FETCH_ALL_INCIDENT_NOTES_ERROR:
        draft.fetchingData = false;
        draft.fetchingIncidentNotes = false;
        draft.status = FETCH_ALL_INCIDENT_NOTES_ERROR;
        draft.error = action.message;
        break;

      case FETCH_ALL_INCIDENT_ALERTS_REQUESTED:
        draft.fetchingData = true;
        draft.fetchingIncidentAlerts = true;
        draft.status = FETCH_ALL_INCIDENT_ALERTS_REQUESTED;
        break;

      case FETCH_ALL_INCIDENT_ALERTS_COMPLETED:
        draft.fetchingData = false;
        draft.fetchingIncidentAlerts = false;
        draft.status = FETCH_ALL_INCIDENT_ALERTS_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case FETCH_ALL_INCIDENT_ALERTS_ERROR:
        draft.fetchingData = false;
        draft.fetchingIncidentAlerts = false;
        draft.status = FETCH_ALL_INCIDENT_ALERTS_ERROR;
        draft.error = action.message;
        break;

      case UPDATE_INCIDENTS_LIST:
        draft.fetchingData = false;
        draft.status = UPDATE_INCIDENTS_LIST;
        break;

      case UPDATE_INCIDENTS_LIST_COMPLETED:
        draft.fetchingData = false;
        draft.status = UPDATE_INCIDENTS_LIST_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case UPDATE_INCIDENTS_LIST_ERROR:
        draft.fetchingData = false;
        draft.status = UPDATE_INCIDENTS_LIST_ERROR;
        draft.error = action.message;
        break;

      case FILTER_INCIDENTS_LIST_BY_PRIORITY:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_PRIORITY;
        break;

      case FILTER_INCIDENTS_LIST_BY_PRIORITY_COMPLETED:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_PRIORITY_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case FILTER_INCIDENTS_LIST_BY_PRIORITY_ERROR:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_PRIORITY_ERROR;
        draft.error = action.message;
        break;

      case FILTER_INCIDENTS_LIST_BY_STATUS:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_STATUS;
        break;

      case FILTER_INCIDENTS_LIST_BY_STATUS_COMPLETED:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_STATUS_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case FILTER_INCIDENTS_LIST_BY_STATUS_ERROR:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_STATUS_ERROR;
        draft.error = action.message;
        break;

      case FILTER_INCIDENTS_LIST_BY_URGENCY:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_URGENCY;
        break;

      case FILTER_INCIDENTS_LIST_BY_URGENCY_COMPLETED:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_URGENCY_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case FILTER_INCIDENTS_LIST_BY_URGENCY_ERROR:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_URGENCY_ERROR;
        draft.error = action.message;
        break;

      case FILTER_INCIDENTS_LIST_BY_TEAM:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_TEAM;
        break;

      case FILTER_INCIDENTS_LIST_BY_TEAM_COMPLETED:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_TEAM_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case FILTER_INCIDENTS_LIST_BY_TEAM_ERROR:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_TEAM_ERROR;
        draft.error = action.message;
        break;

      case FILTER_INCIDENTS_LIST_BY_SERVICE:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_SERVICE;
        break;

      case FILTER_INCIDENTS_LIST_BY_SERVICE_COMPLETED:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_SERVICE_COMPLETED;
        draft.incidents = action.incidents;
        break;

      case FILTER_INCIDENTS_LIST_BY_SERVICE_ERROR:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_SERVICE_ERROR;
        draft.error = action.message;
        break;

      case FILTER_INCIDENTS_LIST_BY_QUERY:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_QUERY;
        break;

      case FILTER_INCIDENTS_LIST_BY_QUERY_COMPLETED:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_QUERY_COMPLETED;
        draft.filteredIncidentsByQuery = action.filteredIncidentsByQuery;
        break;

      case FILTER_INCIDENTS_LIST_BY_QUERY_ERROR:
        draft.fetchingData = false;
        draft.status = FILTER_INCIDENTS_LIST_BY_QUERY_ERROR;
        draft.error = action.message;
        break;

      case UPDATE_INCIDENT_REDUCER_STATUS:
        draft.status = UPDATE_INCIDENT_REDUCER_STATUS;
        draft.fetchingData = action.fetchingData ? action.fetchingData : false;
        draft.fetchingIncidents = action.fetchingIncidents ? action.fetchingIncidents : false;
        draft.fetchingIncidentNotes = action.fetchingIncidentNotes
          ? action.fetchingIncidentNotes
          : false;
        draft.fetchingIncidentAlerts = action.fetchingIncidentAlerts
          ? action.fetchingIncidentAlerts
          : false;
        draft.refreshingIncidents = action.refreshingIncidents ? action.refreshingIncidents : false;
        break;

      default:
        break;
    }
  },
  {
    incidents: [],
    filteredIncidentsByQuery: [],
    status: null,
    fetchingData: false,
    fetchingIncidents: false,
    fetchingIncidentNotes: false,
    fetchingIncidentAlerts: false,
    refreshingIncidents: false,
    error: null,
  },
);

export default incidents;
