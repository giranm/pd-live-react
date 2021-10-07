import { getObjectsFromList } from './helpers';

// Define all possible columns for incidents under PagerDuty's API
export const availableIncidentTableColumns = [
  {
    accessor: 'incident_number',
    Header: '#',
    sortable: true,
    Cell: ({ row }) => (
      <a href={row.original.html_url} target="_blank" rel="noopener noreferrer">
        {row.original.incident_number}
      </a>
    ),
    minWidth: 60,
    width: 60,
  },
  {
    accessor: 'title',
    Header: 'Title',
    sortable: true,
    minWidth: 400,
    width: 400,
  },
  {
    accessor: 'description',
    Header: 'Description',
    sortable: true,
    minWidth: 400,
    width: 400,
  },
  {
    accessor: 'created_at',
    Header: 'Created At',
    sortable: true,
    minWidth: 180,
    width: 180,
  },
  {
    accessor: 'status',
    Header: 'Status',
    sortable: true,
    minWidth: 120,
    width: 120,
  },
  {
    accessor: 'incident_key',
    Header: 'Incident Key',
    sortable: true,
    minWidth: 300,
    width: 300,
  },
  {
    accessor: 'service.summary',
    Header: 'Service',
    sortable: true,
    minWidth: 200,
    width: 200,
  },
  {
    accessor: (incident) => (incident.assignments
      ? incident.assignments.map(({ assignee }) => assignee.summary).join(', ')
      : 'Unassigned'),
    Header: 'Assignees',
    sortable: true,
    minWidth: 200,
    width: 200,
  },
  {
    accessor: 'last_status_change_at',
    Header: 'Last Status Change At',
    sortable: true,
    minWidth: 220,
    width: 220,
  },
  {
    accessor: 'alert_counts.all',
    Header: 'Num Alerts',
    sortable: true,
    minWidth: 130,
    width: 130,
  },
  {
    accessor: 'escalation_policy.summary',
    Header: 'Escalation Policy',
    sortable: true,
    minWidth: 200,
    width: 200,
  },
  {
    accessor: (incident) => (incident.teams ? incident.teams.map((team) => team.summary).join(', ') : 'N/A'),
    Header: 'Teams',
    sortable: true,
    minWidth: 200,
    width: 200,
  },
  {
    accessor: (incident) => (incident.acknowledgements
      ? incident.acknowledgements.map(({ acknowledger }) => acknowledger.summary).join(', ')
      : 'N/A'),
    Header: 'Acknowledgments',
    sortable: true,
    minWidth: 250,
    width: 250,
  },
  {
    accessor: 'last_status_change_by.summary',
    Header: 'Last Status Change By',
    sortable: true,
    minWidth: 250,
    width: 250,
  },
  {
    accessor: (incident) => {
      if (incident.priority) {
        return (
          <p
            style={{
              backgroundColor: `#${incident.priority.color}`,
              color: 'white',
            }}
            className="priority-label"
          >
            {incident.priority.summary}
          </p>
        );
      }
      return <p className="priority-label">--</p>;
    },
    Header: 'Priority',
    sortable: true,
    minWidth: 100,
    width: 100,
    allowOverflow: true,
    sortFunction: (row1, row2) => null, // TBD - this needs to be custom implemented
  },
  // TODO: incidents_responders, responder_requests, subscriber_requests
  {
    accessor: 'urgency',
    Header: 'Urgency',
    sortable: true,
    minWidth: 120,
    width: 120,
  },
  {
    accessor: 'id',
    Header: 'Incident ID',
    sortable: true,
    minWidth: 130,
    width: 130,
  },
  {
    accessor: 'summary',
    Header: 'Summary',
    sortable: true,
    minWidth: 400,
    width: 400,
  },
  {
    accessor: (incident) => {
      if (incident.notes && incident.notes.length > 0) {
        return incident.notes[0].content;
      }
      return '--';
    },
    Header: 'Latest Note',
    sortable: true,
    minWidth: 200,
    width: 200,
    maxWidth: 500,
  },
];

// Helper function to retrieve columns definitions from list of names
export const getIncidentTableColumns = (columnNames) => getObjectsFromList(availableIncidentTableColumns, columnNames, 'Header');
