import {
  Badge, Spinner,
} from 'react-bootstrap';

import {
  connect,
} from 'react-redux';

const SelectedIncidentsComponent = ({
  incidents, incidentTable, querySettings,
}) => {
  const {
    fetchingIncidents,
    fetchingIncidentNotes,
    fetchingIncidentAlerts,
    filteredIncidentsByQuery,
  } = incidents;
  const {
    selectedCount,
  } = incidentTable;
  const {
    error: queryError,
  } = querySettings;

  const fetchingDataRender = (variant, message) => (
    <div className="selected-incidents-ctr">
      <Spinner animation="border" variant={variant} />
      <p className="selected-incidents">{message}</p>
    </div>
  );

  const selectedIncidentsRender = (
    <div className="selected-incidents-ctr">
      <h4>
        <Badge
          className="selected-incidents-badge"
          variant={filteredIncidentsByQuery.length ? 'primary' : 'secondary'}
        >
          {`${selectedCount}/${filteredIncidentsByQuery.length}`}
        </Badge>
      </h4>
      <p className="selected-incidents">Selected</p>
    </div>
  );

  const cancelledQueryRender = (
    <div className="selected-incidents-ctr">
      <h4>
        <Badge className="selected-incidents-badge" variant="warning">
          N/A
        </Badge>
      </h4>
    </div>
  );

  if (queryError) {
    return cancelledQueryRender;
  }

  if (fetchingIncidents) {
    return fetchingDataRender('success', 'Querying');
  }

  if (fetchingIncidentNotes) {
    return fetchingDataRender('primary', 'Fetching Notes');
  }

  if (fetchingIncidentAlerts) {
    return fetchingDataRender('info', 'Fetching Alerts');
  }

  if (!fetchingIncidents && !fetchingIncidentNotes && !fetchingIncidentAlerts) {
    return selectedIncidentsRender;
  }

  return <></>;
};

const mapStateToProps = (state) => ({
  incidents: state.incidents,
  incidentTable: state.incidentTable,
  querySettings: state.querySettings,
});

export default connect(mapStateToProps)(SelectedIncidentsComponent);
