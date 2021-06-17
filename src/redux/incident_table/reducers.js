import produce from "immer";

import {
  UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED,
  UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED
} from "./actions";

const incidentTableSettings = produce(
  (draft, action) => {
    switch (action.type) {
      case UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED:
        draft.status = UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED;
        break;

      case UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED:
        draft.incidentTableColumns = action.incidentTableColumns;
        draft.status = UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED;
        break;

      default:
        break;
    }
  },
  {
    incidentTableColumns: [
      {
        selector: "incident_number",
        name: "#",
        sortable: true,
        width: "80px",
        cell: (row) => {
          return (
            <a href={row.html_url} target="_blank"
              rel="noopener noreferrer">
              {row.incident_number}
            </a>
          )
        }
      },
      {
        selector: "status",
        name: "Status",
        className: "status",
        sortable: true,
        width: "100px"
      },
      {
        selector: "priority.summary",
        name: "Priority",
        sortable: true,
        width: "100px"
      },
      {
        selector: "title",
        name: "Title",
        sortable: true,
        minWidth: "500px"
      },
      {
        selector: "created_at",
        name: "Created At",
        sortable: true,
      },
      {
        selector: "service.summary",
        name: "Service",
        sortable: true,
      },
    ],
    status: null,
    fetchingData: false,
    error: null
  }
);

export default incidentTableSettings;