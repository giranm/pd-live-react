import moment from "moment";

// Define Action Types
export const FETCH_INCIDENTS_REQUESTED = "FETCH_INCIDENTS_REQUESTED";
export const FETCH_INCIDENTS_COMPLETED = "FETCH_INCIDENTS_COMPLETED";
export const FETCH_INCIDENTS_ERROR = "FETCH_INCIDENTS_ERROR";

export const UPDATE_INCIDENTS_LIST = "UPDATE_INCIDENTS_LIST";
export const UPDATE_INCIDENTS_LIST_COMPLETED = "UPDATE_INCIDENTS_LIST_COMPLETED";
export const UPDATE_INCIDENTS_LIST_ERROR = "UPDATE_INCIDENTS_LIST_ERROR";

// Define Actions
export const getIncidentsAsync = (
  since = moment().subtract(1, "days").startOf('date').toDate(),
  until = moment().startOf('date').toDate()
) => ({
  type: FETCH_INCIDENTS_REQUESTED,
  since,
  until
});

export const updateIncidentsListAsync = (addList, updateList, removeList) => ({
  type: UPDATE_INCIDENTS_LIST,
  addList,
  updateList,
  removeList
});