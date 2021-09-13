import { useEffect } from 'react';
import { connect } from "react-redux";
import { Container } from 'react-bootstrap';

import moment from "moment";

import NavigationBarComponent from "components/NavigationBar/NavigationBarComponent";
import QuerySettingsComponent from "components/QuerySettings/QuerySettingsComponent";
import IncidentTableComponent from "components/IncidentTable/IncidentTableComponent";
import IncidentActionsComponent from "components/IncidentActions/IncidentActionsComponent";
import ActionAlertsModalComponent from "components/ActionAlertsModal/ActionAlertsModalComponent";
import CustomSnoozeModalComponent from "components/CustomSnoozeModal/CustomSnoozeModalComponent";
import AddNoteModalComponent from "components/AddNoteModal/AddNoteModalComponent";

import { getIncidentsAsync } from "redux/incidents/actions";
import { getLogEntriesAsync, cleanRecentLogEntriesAsync } from "redux/log_entries/actions";
import { getServicesAsync } from "redux/services/actions";
import { getTeamsAsync } from "redux/teams/actions";
import { getPrioritiesAsync } from "redux/priorities/actions";
import { getCurrentUserAsync } from "redux/users/actions";

import 'App.css';

const App = ({
  logEntries,
  getServicesAsync,
  getTeamsAsync,
  getPrioritiesAsync,
  getCurrentUserAsync,
  getIncidentsAsync,
  getLogEntriesAsync,
  cleanRecentLogEntriesAsync
}) => {
  let now = new Date();
  let until = moment(now).subtract(5, "minutes").toDate();

  // Initial load of objects from API
  useEffect(() => {
    getCurrentUserAsync();
    getServicesAsync();
    getTeamsAsync();
    getPrioritiesAsync();
    getIncidentsAsync();
  }, [])

  // Setup log entry polling.
  useEffect(() => {
    const pollingIntervalSeconds = 5;
    const interval = setInterval(() => {
      // FIXME: Find out why lastPolled does not update in store
      // let lastPolledDate = moment().subtract(2 * pollingIntervalSeconds, "seconds").toDate()
      let lastPolledDate = logEntries.lastPolled;
      getLogEntriesAsync(lastPolledDate);
    }, pollingIntervalSeconds * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <NavigationBarComponent />
      <Container fluid>
        <QuerySettingsComponent />
        <IncidentTableComponent />
        <IncidentActionsComponent />
        <ActionAlertsModalComponent />
        <CustomSnoozeModalComponent />
        <AddNoteModalComponent />
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => ({
  logEntries: state.logEntries
});

const mapDispatchToProps = (dispatch) => ({
  getServicesAsync: (teamIds) => dispatch(getServicesAsync(teamIds)),
  getTeamsAsync: () => dispatch(getTeamsAsync()),
  getPrioritiesAsync: () => dispatch(getPrioritiesAsync()),
  getCurrentUserAsync: () => dispatch(getCurrentUserAsync()),
  getIncidentsAsync: () => dispatch(getIncidentsAsync()),
  getLogEntriesAsync: (since) => dispatch(getLogEntriesAsync(since)),
  cleanRecentLogEntriesAsync: () => dispatch(cleanRecentLogEntriesAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
