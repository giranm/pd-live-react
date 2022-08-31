/* eslint-disable camelcase */
import moment from 'moment';
import {
  JSONPath,
} from 'jsonpath-plus';
import {
  sanitizeUrl,
} from '@braintree/sanitize-url';
import validator from 'validator';

import {
  Badge,
} from 'react-bootstrap';

import {
  FontAwesomeIcon,
} from '@fortawesome/react-fontawesome';
import {
  faChevronUp, faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

import PersonInitialsComponent from 'components/IncidentTable/subcomponents/PersonInitialsComponents';
import StatusComponent from 'components/IncidentTable/subcomponents/StatusComponent';

import {
  DATE_FORMAT,
} from 'config/constants';
import {
  HIGH, LOW,
} from 'util/incidents';
import {
  getObjectsFromList, getTextWidth,
} from 'util/helpers';

// Define all possible columns for incidents under PagerDuty's API
export const availableIncidentTableColumns = [
  {
    columnType: 'incident',
    accessor: 'incident_number',
    Header: '#',
    sortable: true,
    minWidth: 80,
    Cell: ({
      row,
    }) => (
      <a href={row.original.html_url} target="_blank" rel="noopener noreferrer">
        {row.original.incident_number}
      </a>
    ),
  },
  {
    columnType: 'incident',
    accessor: 'title',
    Header: 'Title',
    sortable: true,
    minWidth: 400,
    Cell: ({
      row,
    }) => (
      <a
        href={row.original.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="td-wrapper"
      >
        {row.original.title}
      </a>
    ),
  },
  {
    columnType: 'incident',
    accessor: 'description',
    Header: 'Description',
    sortable: true,
    minWidth: 400,
    Cell: ({
      row,
    }) => <span className="td-wrapper">{row.original.description}</span>,
  },
  {
    columnType: 'incident',
    accessor: 'created_at',
    Header: 'Created At',
    sortable: true,
    minWidth: 180,
    Cell: ({
      row,
    }) => {
      const formattedDate = moment(row.original.created_at).format(DATE_FORMAT);
      return formattedDate;
    },
  },
  {
    columnType: 'incident',
    accessor: 'status',
    Header: 'Status',
    sortable: true,
    minWidth: 100,
    Cell: ({
      row,
    }) => <StatusComponent status={row.original.status} />,
  },
  {
    columnType: 'incident',
    accessor: 'incident_key',
    Header: 'Incident Key',
    sortable: true,
    minWidth: 300,
  },
  {
    columnType: 'incident',
    accessor: 'service.summary',
    Header: 'Service',
    sortable: true,
    minWidth: 150,
    Cell: ({
      row,
    }) => (
      <a
        href={row.original.service.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="td-wrapper"
      >
        {row.original.service.summary}
      </a>
    ),
  },
  {
    columnType: 'incident',
    accessor: (incident) => (incident.assignments
      ? incident.assignments.map(({
        assignee,
      }) => assignee.summary).join(', ')
      : 'Unassigned'),
    Header: 'Assignees',
    sortable: true,
    minWidth: 160,
    Cell: ({
      row,
    }) => {
      const {
        assignments,
      } = row.original.assignments ? row.original : [];
      const users = assignments.length > 0
        ? assignments.map(({
          assignee,
        }) => ({ user: { ...assignee } }))
        : [];
      return <PersonInitialsComponent displayedUsers={users} />;
    },
  },
  {
    columnType: 'incident',
    accessor: 'last_status_change_at',
    Header: 'Last Status Change At',
    sortable: true,
    minWidth: 220,
    // width: 220,
    Cell: ({
      row,
    }) => {
      const formattedDate = moment(row.original.last_status_change_at).format(DATE_FORMAT);
      return formattedDate;
    },
  },
  {
    columnType: 'incident',
    accessor: 'alert_counts.all',
    Header: 'Num Alerts',
    sortable: true,
    minWidth: 130,
  },
  {
    columnType: 'incident',
    accessor: 'escalation_policy.summary',
    Header: 'Escalation Policy',
    sortable: true,
    minWidth: 200,
    Cell: ({
      row,
    }) => (
      <a
        href={row.original.escalation_policy.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="td-wrapper"
      >
        {row.original.escalation_policy.summary}
      </a>
    ),
  },
  {
    columnType: 'incident',
    accessor: (incident) => {
      if (incident.teams) return incident.teams.map((team) => team.summary).join(', ');
      return 'N/A';
    },
    Header: 'Teams',
    sortable: true,
    minWidth: 200,
    Cell: ({
      row,
    }) => {
      const {
        teams,
      } = row.original.teams ? row.original : [];
      if (teams.length > 0) {
        return (
          <div>
            {teams.map((team, idx, {
              length,
            }) => (
              <a
                idx={team.id}
                href={team.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="td-wrapper"
              >
                {team.summary}
                {length - 1 === idx ? null : ', '}
              </a>
            ))}
          </div>
        );
      }
      return null;
    },
  },
  {
    columnType: 'incident',
    accessor: (incident) => (incident.acknowledgements
      ? incident.acknowledgements.map(({
        acknowledger,
      }) => acknowledger.summary).join(', ')
      : 'N/A'),
    Header: 'Acknowledgments',
    sortable: true,
    minWidth: 250,
    Cell: ({
      row,
    }) => {
      const {
        acknowledgements,
      } = row.original.acknowledgements ? row.original : [];
      const users = acknowledgements.length > 0
        ? acknowledgements.map(({
          acknowledger,
        }) => ({ user: { ...acknowledger } }))
        : [];
      return <PersonInitialsComponent displayedUsers={users} />;
    },
  },
  {
    columnType: 'incident',
    accessor: 'last_status_change_by.summary',
    Header: 'Last Status Change By',
    sortable: true,
    minWidth: 250,
    Cell: ({
      row,
    }) => (
      <a
        href={row.original.last_status_change_by.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="td-wrapper"
      >
        {row.original.last_status_change_by.summary}
      </a>
    ),
  },
  {
    columnType: 'incident',
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
    sortType: (row1, row2) => {
      const row1Rank = row1.original.priority ? row1.original.priority.order : 0;
      const row2Rank = row2.original.priority ? row2.original.priority.order : 0;
      const order = row1Rank > row2Rank ? 1 : -1;
      return order;
    },
  },
  // TODO: incidents_responders, responder_requests, subscriber_requests
  {
    columnType: 'incident',
    accessor: 'urgency',
    Header: 'Urgency',
    sortable: true,
    minWidth: 120,
    Cell: ({
      row,
    }) => {
      const {
        urgency,
      } = row.original;
      let elem;
      if (urgency === HIGH) {
        elem = (
          <Badge className="urgency-badge" variant="primary">
            <FontAwesomeIcon icon={faChevronUp} />
            {' '}
            High
          </Badge>
        );
      } else if (urgency === LOW) {
        elem = (
          <Badge className="urgency-badge" variant="secondary">
            <FontAwesomeIcon icon={faChevronDown} />
            {' '}
            Low
          </Badge>
        );
      }
      return elem;
    },
  },
  {
    columnType: 'incident',
    accessor: 'id',
    Header: 'Incident ID',
    sortable: true,
    minWidth: 160,
  },
  {
    columnType: 'incident',
    accessor: 'summary',
    Header: 'Summary',
    sortable: true,
    minWidth: 400,
    Cell: ({
      row,
    }) => <span className="td-wrapper">{row.original.description}</span>,
  },
  {
    columnType: 'incident',
    accessor: (incident) => {
      let content;
      if (incident.notes && incident.notes.length > 0) {
        content = incident.notes[0].content;
      } else if (incident.notes && incident.notes.length === 0) {
        content = '--';
      } else {
        content = 'Fetching notes ...';
      }
      return content;
    },
    Header: 'Latest Note',
    sortable: true,
    minWidth: 200,
    Cell: ({
      value,
    }) => <div className="td-wrapper">{value}</div>,
  },
  {
    columnType: 'incident',
    accessor: (incident) => (incident.external_references
      ? incident.external_references.map((ext) => ext.external_id).join(', ')
      : 'N/A'),
    Header: 'External References',
    sortable: true,
    minWidth: 200,
    Cell: ({
      row,
    }) => {
      let external_references = [];
      if (row.original && row.original.external_references) {
        external_references = row.original.external_references;
      }
      if (external_references.length > 0) {
        return (
          <div>
            {external_references.map((ext, idx, {
              length,
            }) => (
              <a
                idx={ext.id}
                href={ext.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="td-wrapper"
              >
                {`${ext.summary} (${ext.external_id})`}
                {length - 1 === idx ? null : ', '}
              </a>
            ))}
          </div>
        );
      }
      return '--';
    },
  },
];

// Define all possible columns for alerts under PagerDuty's API
export const availableAlertTableColumns = [
  {
    columnType: 'alert',
    accessor: (incident) => {
      let content;
      if (
        incident.alerts
        && incident.alerts.length > 0
        && incident.alerts[0].body
        && incident.alerts[0].body.cef_details
        && incident.alerts[0].body.cef_details.severity
      ) {
        content = incident.alerts[0].body.cef_details.severity;
      } else if (incident.alerts) {
        content = '--';
      } else {
        content = 'Fetching alerts ...';
      }
      return content;
    },
    Header: 'Severity',
    sortable: true,
    minWidth: 100,
    sortType: (row1, row2) => {
      const severityRank = {
        critical: 4,
        error: 3,
        warning: 2,
        info: 1,
        '--': 0,
      };
      const row1Rank = row1.values.Severity ? severityRank[row1.values.Severity] : 0;
      const row2Rank = row2.values.Severity ? severityRank[row2.values.Severity] : 0;
      const order = row1Rank > row2Rank ? 1 : -1;
      return order;
    },
    Cell: ({
      value,
    }) => {
      let variant = '';
      switch (value) {
        case 'critical':
          variant = 'dark';
          break;
        case 'error':
          variant = 'danger';
          break;
        case 'warning':
          variant = 'warning';
          break;
        case 'info':
          variant = 'info';
          break;
        default:
          variant = null;
          break;
      }
      return (
        <Badge className="urgency-badge" variant={variant}>
          {value}
        </Badge>
      );
    },
  },
  {
    columnType: 'alert',
    accessor: (incident) => {
      let content;
      if (
        incident.alerts
        && incident.alerts.length > 0
        && incident.alerts[0].body
        && incident.alerts[0].body.cef_details
        && incident.alerts[0].body.cef_details.source_component
      ) {
        content = incident.alerts[0].body.cef_details.source_component;
      } else if (incident.alerts) {
        content = '--';
      } else {
        content = 'Fetching alerts ...';
      }
      return content;
    },
    Header: 'Component',
    sortable: true,
    minWidth: 130,
    Cell: ({
      value,
    }) => <div className="td-wrapper">{value}</div>,
  },
  {
    columnType: 'alert',
    accessor: (incident) => {
      let content;
      if (
        incident.alerts
        && incident.alerts.length > 0
        && incident.alerts[0].body
        && incident.alerts[0].body.cef_details
        && incident.alerts[0].body.cef_details.source_origin
      ) {
        content = incident.alerts[0].body.cef_details.source_origin;
      } else if (incident.alerts) {
        content = '--';
      } else {
        content = 'Fetching alerts ...';
      }
      return content;
    },
    Header: 'Source',
    sortable: true,
    minWidth: 100,
    Cell: ({
      value,
    }) => <div className="td-wrapper">{value}</div>,
  },
  {
    columnType: 'alert',
    accessor: (incident) => {
      let content;
      if (
        incident.alerts
        && incident.alerts.length > 0
        && incident.alerts[0].body
        && incident.alerts[0].body.cef_details
        && incident.alerts[0].body.cef_details.event_class
      ) {
        content = incident.alerts[0].body.cef_details.event_class;
      } else if (incident.alerts) {
        content = '--';
      } else {
        content = 'Fetching alerts ...';
      }
      return content;
    },
    Header: 'Class',
    sortable: true,
    minWidth: 100,
    Cell: ({
      value,
    }) => <div className="td-wrapper">{value}</div>,
  },
  {
    columnType: 'alert',
    accessor: (incident) => {
      let content;
      if (
        incident.alerts
        && incident.alerts.length > 0
        && incident.alerts[0].body
        && incident.alerts[0].body.cef_details
        && incident.alerts[0].body.cef_details.service_group
      ) {
        content = incident.alerts[0].body.cef_details.service_group;
      } else if (incident.alerts) {
        content = '--';
      } else {
        content = 'Fetching alerts ...';
      }
      return content;
    },
    Header: 'Group',
    sortable: true,
    minWidth: 100,
    Cell: ({
      value,
    }) => <div className="td-wrapper">{value}</div>,
  },
];

// Helper function to define a column for a custom field from the incident object
export const customReactTableColumnSchema = (
  columnType,
  header,
  accessorPath,
  aggregator = null,
) => {
  let accessor;
  let fullJsonPath;
  let result;
  let content;
  // Handle accessorPath based on columnType (e.g. alert vs custom incident field)
  if (columnType === 'alert') {
    accessor = (incident) => {
      // Determine if field content should be aggregated or from latest alert
      if (aggregator) {
        fullJsonPath = `alerts[*].body.cef_details.${accessorPath}`;
      } else {
        fullJsonPath = `alerts[0].body.cef_details.${accessorPath}`;
      }
      try {
        result = JSONPath({
          path: fullJsonPath,
          json: incident,
          wrap: false,
        });
      } catch (e) {
        result = null;
      }
      if (!accessorPath) {
        content = 'Invalid JSON Path';
      } else if (result && !Array.isArray(result)) {
        content = result;
      } else if (result && Array.isArray(result)) {
        // Deduplicate values if aggregator is used
        if (aggregator) {
          content = [...new Set(result)].sort().join(', ');
        } else {
          content = result.join(', ');
        }
      } else if (!result) {
        content = '--';
      } else {
        // FIXME: This codepath doesn't work
        content = 'Fetching alerts ...';
      }
      return content;
    };
  } else if (columnType === 'custom') {
    accessor = (incident) => {
      // Identify index of custom field
      const fieldIdx = incident.field_values
        ? incident.field_values.findIndex((field) => field.display_name === header)
        : null;
      // Determine if field content should be aggregated
      if (aggregator) {
        fullJsonPath = `field_values[${fieldIdx}].value[*]`;
      } else {
        fullJsonPath = `field_values[${fieldIdx}].value`;
      }
      try {
        result = JSONPath({
          path: fullJsonPath,
          json: incident,
          wrap: false,
        });
      } catch (e) {
        result = null;
      }
      if (result && !Array.isArray(result)) {
        content = result;
      } else if (result && Array.isArray(result)) {
        // Deduplicate values if aggregator is used
        if (aggregator) {
          content = [...new Set(result)].sort().join(', ');
        } else {
          content = result.join(', ');
        }
      } else if (!result) {
        content = '--';
      } else {
        content = 'Fetching custom fields ...';
      }
      return content;
    };
  }
  return {
    columnType,
    accessorPath,
    fullJsonPath,
    accessor,
    aggregator,
    Header: header,
    sortable: true,
    minWidth: getTextWidth(header, 'bold 16px sans-serif') + 40,
    Cell: ({
      value,
    }) => {
      // Determine if content should be rendered as link or plaintext
      const stringValue = value.toString(); // Handle numeric types from custom fields
      const sanitizedValue = sanitizeUrl(stringValue);
      if (validator.isURL(sanitizedValue)) {
        return (
          <a href={sanitizedValue} target="_blank" rel="noopener noreferrer" className="td-wrapper">
            {sanitizedValue}
          </a>
        );
      }
      return <div className="td-wrapper">{value}</div>;
    },
  };
};

// Helper function to retrieve React Table column schemas from list of column objects
export const getReactTableColumnSchemas = (columns) => {
  const reactTableColumnSchemas = [];
  if (columns) {
    columns.forEach((col) => {
      let columnSchema;
      if (col.columnType === 'incident') {
        // Handle standard incident data in column
        columnSchema = {
          ...getObjectsFromList(availableIncidentTableColumns, [col.Header], 'Header')[0],
        };
      } else if (col.columnType === 'alert') {
        // Handle alert level data in column
        switch (col.Header) {
          // Standard PD-CEF fields
          case 'Severity':
          case 'Group':
          case 'Source':
          case 'Component':
          case 'Class':
            columnSchema = {
              ...getObjectsFromList(availableAlertTableColumns, [col.Header], 'Header')[0],
            };
            break;
          // Custom alert details
          default:
            columnSchema = {
              ...customReactTableColumnSchema(
                'alert',
                col.Header,
                col.accessorPath,
                col.aggregator,
              ),
            };
        }
      } else if (col.columnType === 'custom') {
        columnSchema = {
          ...customReactTableColumnSchema('custom', col.Header, col.accessorPath),
        };
      }
      // Explicitly set width for rendering (this may come from existing redux store)
      columnSchema.width = col.width;
      reactTableColumnSchemas.push(columnSchema);
    });
  }
  return reactTableColumnSchemas;
};
