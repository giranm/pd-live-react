import { useEffect } from 'react';
import { connect } from "react-redux";
import { Navbar, Container, Row } from 'react-bootstrap';

import moment from "moment";

import IncidentTableComponent from "components/IncidentTable/IncidentTableComponent";
import IncidentViewer from "components/IncidentViewer/IncidentViewer";

import { getIncidentsAsync } from "redux/incidents/actions";
import { getLogEntriesAsync, cleanRecentLogEntriesAsync } from "redux/log_entries/actions";

import logo from "assets/images/pd_logo.png";
import 'App.css';

const App = ({ incidents, logEntries, getIncidentsAsync, getLogEntriesAsync, cleanRecentLogEntriesAsync }) => {
  let since = new Date("2021-06-14");
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
      <div className="navbar-ctr">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>
            <img className="nav-bar-logo" src={logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Brand className="font-weight-bold">
            PagerDuty Live Incidents Console
          </Navbar.Brand>
        </Navbar>
      </div>
      <Container fluid>
        <Row>
          <button onClick={() => getIncidentsAsync(since, now)}>getIncidentsAsync</button>
          <button onClick={() => getLogEntriesAsync(until)}>getLogEntriesAsync</button>
          <button onClick={() => cleanRecentLogEntriesAsync()}>cleanRecentLogEntriesAsync</button>
        </Row>
        <div className="incidents-table-ctr">
          {/* Disabling until properly refactored */}
          <IncidentTableComponent />
          {/* <IncidentViewer /> */}
        </div>
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => ({
  incidents: state.incidents,
  logEntries: state.logEntries
});

const mapDispatchToProps = (dispatch) => ({
  getIncidentsAsync: (since, until) => dispatch(getIncidentsAsync(since, until)),
  getLogEntriesAsync: (since) => dispatch(getLogEntriesAsync(since)),
  cleanRecentLogEntriesAsync: () => dispatch(cleanRecentLogEntriesAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
