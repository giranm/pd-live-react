import moment from 'moment';

import { Badge } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faShieldAlt,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

import { DATE_FORMAT } from 'util/constants';
import {
  TRIGGERED,
  ACKNOWLEDGED,
  RESOLVED,
} from 'util/incidents';
import {
  getObjectsFromListbyKey,
  getObjectsFromList,
  getInitials,
} from './helpers';

// Define all possible columns for incidents under PagerDuty's API
export const availableIncidentTableColumns = [
  {
    accessor: 'incident_number',
    Header: '#',
    sortable: true,
    minWidth: 80,
    width: 80,
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
    minWidth: 400,
    width: 600,
    Cell: ({ row }) => (
      <a href={row.original.html_url} target="_blank" rel="noopener noreferrer">
        {row.original.title}
      </a>
    ),
  },
  {
    accessor: 'description',
    Header: 'Description',
    sortable: true,
    minWidth: 400,
    width: 600,
  },
  {
    accessor: 'created_at',
    Header: 'Created At',
    sortable: true,
    minWidth: 180,
    width: 180,
    Cell: ({ row }) => {
      const formattedDate = moment(row.original.created_at).format(DATE_FORMAT);
      return formattedDate;
    },
  },
  {
    accessor: 'status',
    Header: 'Status',
    sortable: true,
    minWidth: 120,
    width: 120,
    Cell: ({ row }) => {
      const { status } = row.original;
      let elem;
      if (status === TRIGGERED) {
        elem = (
          <Badge className="status-badge" variant="danger">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </Badge>
        );
      } else if (status === ACKNOWLEDGED) {
        elem = (
          <Badge className="status-badge" variant="warning">
            <FontAwesomeIcon icon={faShieldAlt} />
          </Badge>
        );
      } else if (status === RESOLVED) {
        elem = (
          <Badge className="status-badge" variant="success">
            <FontAwesomeIcon icon={faCheckCircle} />
          </Badge>
        );
      }
      return elem;
    },
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
    minWidth: 300,
    width: 300,
    Cell: ({ row }) => (
      <a href={row.original.service.html_url} target="_blank" rel="noopener noreferrer">
        {row.original.service.summary}
      </a>
    ),
  },
  {
    Header: 'Assignees',
    sortable: true,
    minWidth: 200,
    width: 200,
    Cell: ({ row }) => {
      const { assignments } = row.original.assignments
        ? row.original
        : [];
      const assignmentsByInitials = assignments.length > 0
        ? assignments.map(
          ({ assignee }) => ({
            initials: getInitials(assignee.summary),
            id: assignee.id,
            html_url: assignee.html_url,
          }),
        )
        : [];
      if (assignmentsByInitials.length > 0) {
        // TODO: Replace with component that is attached to store
        // const user = getObjectsFromListbyKey();
        // const backgroundColor = '';
        return (
          <div>
            {assignmentsByInitials.map((assignee) => (
              <div
                idx={assignee.id}
                // className="assignment-badge"
                style={{
                  backgroundColor: 'lime-green',
                }}
              >
                {assignee.initials}
              </div>
            ))}
          </div>
        );
      }
      return (
        <div>
          <Badge>
            Unassigned
          </Badge>
        </div>
      );
    },
  },
  {
    accessor: 'last_status_change_at',
    Header: 'Last Status Change At',
    sortable: true,
    minWidth: 220,
    width: 220,
    Cell: ({ row }) => {
      const formattedDate = moment(row.original.last_status_change_at).format(DATE_FORMAT);
      return formattedDate;
    },
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
    Cell: ({ row }) => (
      <a href={row.original.escalation_policy.html_url} target="_blank" rel="noopener noreferrer">
        {row.original.escalation_policy.summary}
      </a>
    ),
  },
  {
    accessor: (incident) => (incident.teams
      ? incident.teams.map((team) => team.summary).join(', ')
      : 'N/A'),
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
          <div
            style={{
              backgroundColor: `#${incident.priority.color}`,
              color: 'white',
            }}
            className="priority-label"
          >
            {incident.priority.summary}
          </div>
        );
      }
      return <div className="priority-label">--</div>;
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
    minWidth: 160,
    width: 160,
  },
  {
    accessor: 'summary',
    Header: 'Summary',
    sortable: true,
    minWidth: 400,
    width: 600,
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
