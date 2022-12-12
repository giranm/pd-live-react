import {
  Badge, Spinner,
} from 'react-bootstrap';

import {
  connect,
} from 'react-redux';

import {
  useTranslation,
} from 'react-i18next';

const SelectedIncidentsComponent = ({
  incidents, incidentTable, querySettings,
}) => {
  const {
    t,
  } = useTranslation();
  const {
    fetchingIncidents,
    fetchingIncidentNotes,
    fetchingIncidentAlerts,
    filteredIncidentsByQuery,
    refreshingIncidents,
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
          bg={filteredIncidentsByQuery.length ? 'primary' : 'secondary'}
        >
          {`${selectedCount}/${filteredIncidentsByQuery.length}`}
        </Badge>
      </h4>
      <p className="selected-incidents">{t('Selected')}</p>
    </div>
  );

  const cancelledQueryRender = (
    <div className="selected-incidents-ctr">
      <h4>
        <Badge className="selected-incidents-badge" variant="warning">
          {t('N/A')}
        </Badge>
      </h4>
    </div>
  );

  if (queryError) {
    return cancelledQueryRender;
  }

  if (fetchingIncidents) {
    return fetchingDataRender('success', t('Querying'));
  }

  if (fetchingIncidentNotes) {
    return fetchingDataRender('primary', t('Fetching Notes'));
  }

  if (fetchingIncidentAlerts) {
    return fetchingDataRender('info', t('Fetching Alerts'));
  }

  if (refreshingIncidents) {
    return fetchingDataRender('success', t('Refreshing'));
  }

  if (
    !fetchingIncidents
    && !fetchingIncidentNotes
    && !fetchingIncidentAlerts
    && !refreshingIncidents
  ) {
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
