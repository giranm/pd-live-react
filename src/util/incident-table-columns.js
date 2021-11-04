import moment from 'moment';

import {
  Badge,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faShieldAlt,
  faCheckCircle,
  faChevronUp,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

import PersonInitialsComponent
  from 'components/IncidentTable/subcomponents/PersonInitialsComponents';

import StatusComponent from 'components/IncidentTable/subcomponents/StatusComponent';

import { DATE_FORMAT } from 'util/constants';
import {
  TRIGGERED,
  ACKNOWLEDGED,
  RESOLVED,
  HIGH,
  LOW,
} from 'util/incidents';
import {
  getObjectsFromList,
} from './helpers';

// Define all possible columns for incidents under PagerDuty's API
export const availableIncidentTableColumns = [
  {
    accessor: 'incident_number',
    Header: '#',
    sortable: true,
    minWidth: 80,
    // width: 80,
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
    // width: 800,
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
    // width: 800,
  },
  {
    accessor: 'created_at',
    Header: 'Created At',
    sortable: true,
    minWidth: 180,
    // width: 180,
    Cell: ({ row }) => {
      const formattedDate = moment(row.original.created_at).format(DATE_FORMAT);
      return formattedDate;
    },
  },
  {
    accessor: 'status',
    Header: 'Status',
    sortable: true,
    minWidth: 100,
    // width: 160,
    // maxWidth: 160,
    Cell: ({ row }) => <StatusComponent status={row.original.status} />,
  },
  {
    accessor: 'incident_key',
    Header: 'Incident Key',
    sortable: true,
    minWidth: 300,
    // width: 300,
  },
  {
    accessor: 'service.summary',
    Header: 'Service',
    sortable: true,
    minWidth: 300,
    // width: 300,
    Cell: ({ row }) => (
      <a href={row.original.service.html_url} target="_blank" rel="noopener noreferrer">
        {row.original.service.summary}
      </a>
    ),
  },
  {
    accessor: (incident) => (incident.assignments
      ? incident.assignments.map(({ assignee }) => assignee.summary).join(', ')
      : 'Unassigned'),
    Header: 'Assignees',
    sortable: true,
    minWidth: 160,
    // width: 160,
    Cell: ({ row }) => {
      const { assignments } = row.original.assignments
        ? row.original
        : [];
      const users = assignments.length > 0
        ? assignments.map(({ assignee }) => ({ user: { ...assignee } }))
        : [];
      return <PersonInitialsComponent displayedUsers={users} />;
    },
  },
  {
    accessor: 'last_status_change_at',
    Header: 'Last Status Change At',
    sortable: true,
    minWidth: 220,
    // width: 220,
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
    // width: 130,
  },
  {
    accessor: 'escalation_policy.summary',
    Header: 'Escalation Policy',
    sortable: true,
    minWidth: 200,
    // width: 200,
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
    // width: 200,
    Cell: ({ row }) => {
      const { teams } = row.original.teams
        ? row.original
        : [];
      if (teams.length > 0) {
        return (
          <div>
            {teams.map((team, idx, { length }) => (
              <a
                idx={team.id}
                href={team.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {team.summary}{length - 1 === idx ? null : ', '}
              </a>
            ))}
          </div>
        );
      }
      return null;
    },
  },
  {
    accessor: (incident) => (incident.acknowledgements
      ? incident.acknowledgements.map(({ acknowledger }) => acknowledger.summary).join(', ')
      : 'N/A'),
    Header: 'Acknowledgments',
    sortable: true,
    minWidth: 250,
    // width: 250,
    Cell: ({ row }) => {
      const { acknowledgements } = row.original.acknowledgements
        ? row.original
        : [];
      const users = acknowledgements.length > 0
        ? acknowledgements.map(({ acknowledger }) => ({ user: { ...acknowledger } }))
        : [];
      return <PersonInitialsComponent displayedUsers={users} />;
    },
  },
  {
    accessor: 'last_status_change_by.summary',
    Header: 'Last Status Change By',
    sortable: true,
    minWidth: 250,
    // width: 250,
    Cell: ({ row }) => (
      <a
        href={row.original.last_status_change_by.html_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {row.original.last_status_change_by.summary}
      </a>
    ),
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
    minWidth: 90,
    // width: 90,
    sortType: (row1, row2) => {
      const row1Rank = row1.original.priority ? row1.original.priority.order : 0;
      const row2Rank = row2.original.priority ? row2.original.priority.order : 0;
      const order = row1Rank > row2Rank ? 1 : -1;
      return order;
    },
  },
  // TODO: incidents_responders, responder_requests, subscriber_requests
  {
    accessor: 'urgency',
    Header: 'Urgency',
    sortable: true,
    minWidth: 120,
    // width: 120,
    Cell: ({ row }) => {
      const { urgency } = row.original;
      let elem;
      if (urgency === HIGH) {
        elem = (
          <Badge className="urgency-badge" variant="primary">
            <FontAwesomeIcon icon={faChevronUp} /> High
          </Badge>
        );
      } else if (urgency === LOW) {
        elem = (
          <Badge className="urgency-badge" variant="secondary">
            <FontAwesomeIcon icon={faChevronDown} /> Low
          </Badge>
        );
      }
      return elem;
    },
  },
  {
    accessor: 'id',
    Header: 'Incident ID',
    sortable: true,
    minWidth: 160,
    // width: 160,
  },
  {
    accessor: 'summary',
    Header: 'Summary',
    sortable: true,
    minWidth: 400,
    // width: 800,
  },
  {
    accessor: (incident) => {
      if (incident.notes && incident.notes.length > 0) {
        return incident.notes[0].content;
      } if (incident.notes && incident.notes.length === 0) {
        return '--';
      }
      return 'Fetching notes ...';
    },
    Header: 'Latest Note',
    sortable: true,
    minWidth: 200,
    // width: 200,
    // maxWidth: 500,
  },
  {
    accessor: (incident) => (incident.external_references
      ? incident.external_references.map((ext) => ext.external_id).join(', ')
      : 'N/A'),
    Header: 'External References',
    sortable: true,
    minWidth: 200,
    Cell: ({ row }) => {
      // eslint-disable-next-line camelcase
      const { external_references } = row.original.external_references
        ? row.original
        : [];
      if (external_references.length > 0) {
        return (
          <div>
            {external_references.map((ext, idx, { length }) => (
              <a
                idx={ext.id}
                href={ext.external_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`${ext.summary} (${ext.external_id})`}{length - 1 === idx ? null : ', '}
              </a>
            ))}
          </div>
        );
      }
      return '--';
    },
  },
];

// Helper function to retrieve columns definitions from list of names
export const getIncidentTableColumns = (columnNames) => getObjectsFromList(
  availableIncidentTableColumns, columnNames, 'Header',
);
