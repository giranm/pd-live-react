import { connect } from 'react-redux';

import { Row, Col } from 'react-bootstrap';

import moment from 'moment';

import { getIncidentsAsync } from 'redux/incidents/actions';
import { getLogEntriesAsync, cleanRecentLogEntriesAsync } from 'redux/log_entries/actions';

const IncidentViewer = ({
  incidents,
  logEntries,
  getIncidentsAsync,
  getLogEntriesAsync,
  cleanRecentLogEntriesAsync,
}) => {
  const since = new Date('2021-06-14');
  const now = new Date();
  const until = moment(now).subtract(5, 'minutes').toDate();
  return (
    <div>
      <Row>
        <button onClick={() => getIncidentsAsync(since, now)}>getIncidentsAsync</button>
        <button onClick={() => getLogEntriesAsync(until)}>getLogEntriesAsync</button>
        <button onClick={() => cleanRecentLogEntriesAsync()}>cleanRecentLogEntriesAsync</button>
      </Row>
      <Row>
        <Col>
          <pre>{JSON.stringify(incidents, null, 2)}</pre>
        </Col>
        <Col>
          <pre>{JSON.stringify(logEntries, null, 2)}</pre>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  incidents: state.incidents,
  logEntries: state.logEntries,
});

const mapDispatchToProps = (dispatch) => ({
  getIncidentsAsync: (since, until) => dispatch(getIncidentsAsync(since, until)),
  getLogEntriesAsync: (since) => dispatch(getLogEntriesAsync(since)),
  cleanRecentLogEntriesAsync: () => dispatch(cleanRecentLogEntriesAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentViewer);
