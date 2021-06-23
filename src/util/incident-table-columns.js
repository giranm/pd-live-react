import { getObjectsFromList } from "./helpers"

// Define all possible columns for incidents under PagerDuty's API
export const availableIncidentTableColumns = [
  {
    selector: "incident_number",
    name: "#",
    sortable: true,
    cell: (incident) => {
      return (
        <a href={incident.html_url} target="_blank"
          rel="noopener noreferrer">
          {incident.incident_number}
        </a>
      )
    }
  },
  {
    selector: "title",
    name: "Title",
    sortable: true,
    minWidth: "500px"
  },
  {
    selector: "description",
    name: "Description",
    sortable: true,
  },
  {
    selector: "created_at",
    name: "Created At",
    sortable: true,
  },
  {
    selector: "status",
    name: "Status",
    sortable: true,
    minWidth: "100px"
  },
  {
    selector: "incident_key",
    name: "Incident Key",
    sortable: true,
  },
  {
    selector: "service.summary",
    name: "Service",
    sortable: true,
  },
  {
    selector: (incident) =>
      incident.assignments
        ? incident.assignments
          .map(({ assignee }) => assignee.summary)
          .join(", ")
        : "Unassigned",
    name: "Assignees",
    sortable: true,
    minWidth: "100px"
  },
  {
    selector: "last_status_change_at",
    name: "Last Status Change At",
    sortable: true,
  },
  {
    selector: "alert_counts.all",
    name: "Num Alerts",
    sortable: true,
  },
  {
    selector: "escalation_policy.summary",
    name: "Escalaion Policy",
    sortable: true,
  },
  {
    selector: (incident) =>
      incident.teams
        ? incident.teams.map((team) => team.summary).join(", ")
        : "N/A",
    name: "Teams",
    sortable: true,
    minWidth: "100px"
  },
  {
    selector: (incident) =>
      incident.acknowledgements
        ? incident.acknowledgements
          .map(({ acknowledger }) => acknowledger.summary)
          .join(", ")
        : "N/A",
    name: "Acknowledgments",
    sortable: true,
    minWidth: "100px"
  },
  {
    selector: "last_status_change_by.summary",
    name: "Last Status Change By",
    sortable: true,
  },
  {
    selector: (incident) => {
      if (incident.priority) {
        return (
          <p
            style={{
              backgroundColor: `#${incident.priority.color}`,
              color: "white",
            }}
            className="priority-label"
          >
            {incident.priority.summary}
          </p>
        );
      } else {
        return (<p className="priority-label">--</p>);
      }
    },
    name: "Priority",
    sortable: true,
    minWidth: "100px",
    allowOverflow: true,
    sortFunction: (row1, row2) => null // TBD - this needs to be custom implemented
  },
  // TODO: incidents_responders, responder_requests, subscriber_requests
  {
    selector: "urgency",
    name: "Urgency",
    sortable: true,
  },
  {
    selector: "id",
    name: "Incident ID",
    sortable: true,
  },
  {
    selector: "summary",
    name: "Summary",
    sortable: true,
    minWidth: "500px"
  },
]

// Helper function to retrieve columns definitions from list of names
export const getIncidentTableColumns = (columnNames) => {
  return getObjectsFromList(availableIncidentTableColumns, columnNames, "name")
}