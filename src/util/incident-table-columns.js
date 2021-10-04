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
  },
  {
    accessor: 'title',
    Header: 'Title',
    sortable: true,
    width: '500px',
  },
  {
    accessor: 'description',
    Header: 'Description',
    sortable: true,
  },
  {
    accessor: 'created_at',
    Header: 'Created At',
    sortable: true,
  },
  {
    accessor: 'status',
    Header: 'Status',
    sortable: true,
    width: '100px',
  },
  {
    accessor: 'incident_key',
    Header: 'Incident Key',
    sortable: true,
  },
  {
    accessor: 'service.summary',
    Header: 'Service',
    sortable: true,
  },
  {
    accessor: (incident) => (incident.assignments
      ? incident.assignments.map(({ assignee }) => assignee.summary).join(', ')
      : 'Unassigned'),
    Header: 'Assignees',
    sortable: true,
    width: '100px',
  },
  {
    accessor: 'last_status_change_at',
    Header: 'Last Status Change At',
    sortable: true,
  },
  {
    accessor: 'alert_counts.all',
    Header: 'Num Alerts',
    sortable: true,
  },
  {
    accessor: 'escalation_policy.summary',
    Header: 'Escalation Policy',
    sortable: true,
  },
  {
    accessor: (incident) => (incident.teams ? incident.teams.map((team) => team.summary).join(', ') : 'N/A'),
    Header: 'Teams',
    sortable: true,
    width: '100px',
  },
  {
    accessor: (incident) => (incident.acknowledgements
      ? incident.acknowledgements.map(({ acknowledger }) => acknowledger.summary).join(', ')
      : 'N/A'),
    Header: 'Acknowledgments',
    sortable: true,
    width: '100px',
  },
  {
    accessor: 'last_status_change_by.summary',
    Header: 'Last Status Change By',
    sortable: true,
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
    width: '100px',
    allowOverflow: true,
    sortFunction: (row1, row2) => null, // TBD - this needs to be custom implemented
  },
  // TODO: incidents_responders, responder_requests, subscriber_requests
  {
    accessor: 'urgency',
    Header: 'Urgency',
    sortable: true,
  },
  {
    accessor: 'id',
    Header: 'Incident ID',
    sortable: true,
  },
  {
    accessor: 'summary',
    Header: 'Summary',
    sortable: true,
    width: '500px',
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
    width: '400px',
  },
];

// Helper function to retrieve columns definitions from list of names
export const getIncidentTableColumns = (columnNames) => getObjectsFromList(availableIncidentTableColumns, columnNames, 'Header');
