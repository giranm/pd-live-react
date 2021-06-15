import { useEffect } from 'react';
import { connect } from "react-redux";
import { Container } from 'react-bootstrap';

import moment from "moment";

import NavigationBarComponent from "components/NavigationBar/NavigationBarComponent";
import QuerySettingsComponent from "components/QuerySettings/QuerySettingsComponent";
import IncidentTableComponent from "components/IncidentTable/IncidentTableComponent";
import IncidentActionsComponent from "components/IncidentActions/IncidentActionsComponent";

import { getIncidentsAsync } from "redux/incidents/actions";
import { getLogEntriesAsync, cleanRecentLogEntriesAsync } from "redux/log_entries/actions";

import 'App.css';

const App = ({ logEntries, getIncidentsAsync, getLogEntriesAsync, cleanRecentLogEntriesAsync }) => {
  let since = new Date("2021-06-15");
  let now = new Date();
  let until = moment(now).subtract(5, "minutes").toDate();

  // Initial grab incidents from API
  getIncidentsAsync(since, now)

  // Setup log entry polling.
  let { lastPolled } = logEntries;
  useEffect(() => {
    const interval = setInterval(() => {
      let lastPolledDate = lastPolled ? new Date(lastPolled) : until;
      getLogEntriesAsync(lastPolledDate);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <NavigationBarComponent />
      <Container fluid>
        {/* <Row>
          <button onClick={() => getIncidentsAsync(since, now)}>getIncidentsAsync</button>
          <button onClick={() => getLogEntriesAsync(until)}>getLogEntriesAsync</button>
          <button onClick={() => cleanRecentLogEntriesAsync()}>cleanRecentLogEntriesAsync</button>
        </Row> */}
        <QuerySettingsComponent />
        <IncidentTableComponent />
        <IncidentActionsComponent />
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => ({
  logEntries: state.logEntries
});

const mapDispatchToProps = (dispatch) => ({
  getIncidentsAsync: (since, until) => dispatch(getIncidentsAsync(since, until)),
  getLogEntriesAsync: (since) => dispatch(getLogEntriesAsync(since)),
  cleanRecentLogEntriesAsync: () => dispatch(cleanRecentLogEntriesAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
