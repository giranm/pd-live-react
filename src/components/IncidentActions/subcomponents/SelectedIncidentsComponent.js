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
    fetchingIncidents, filteredIncidentsByQuery,
  } = incidents;
  const {
    selectedCount,
  } = incidentTable;
  const {
    error: queryError,
  } = querySettings;

  const queryIncidentsRender = (
    <div className="selected-incidents-ctr">
      <Spinner animation="border" variant="success" />
      <p className="selected-incidents">Querying</p>
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
    return queryIncidentsRender;
  }

  if (!fetchingIncidents) {
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
