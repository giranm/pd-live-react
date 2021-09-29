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
import ReassignModalComponent from "components/ReassignModal/ReassignModalComponent";

import { getIncidentsAsync } from "redux/incidents/actions";
import { getLogEntriesAsync, cleanRecentLogEntriesAsync } from "redux/log_entries/actions";
import { getServicesAsync } from "redux/services/actions";
import { getTeamsAsync } from "redux/teams/actions";
import { getPrioritiesAsync } from "redux/priorities/actions";
import { getUsersAsync, getCurrentUserAsync } from "redux/users/actions";
import { getEscalationPoliciesAsync } from "redux/escalation_policies/actions";

import 'App.css';

const App = ({
  logEntries,
  getServicesAsync,
  getTeamsAsync,
  getPrioritiesAsync,
  getUsersAsync,
  getCurrentUserAsync,
  getEscalationPoliciesAsync,
  getIncidentsAsync,
  getLogEntriesAsync,
  cleanRecentLogEntriesAsync
}) => {
  let now = new Date();
  let until = moment(now).subtract(5, "minutes").toDate();

  // Initial load of objects from API
  useEffect(() => {
    getUsersAsync();
    getCurrentUserAsync();
    getServicesAsync();
    getTeamsAsync();
    getPrioritiesAsync();
    getEscalationPoliciesAsync();
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
        <ReassignModalComponent />
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
  getUsersAsync: () => dispatch(getUsersAsync()),
  getCurrentUserAsync: () => dispatch(getCurrentUserAsync()),
  getEscalationPoliciesAsync: () => dispatch(getEscalationPoliciesAsync()),
  getIncidentsAsync: () => dispatch(getIncidentsAsync()),
  getLogEntriesAsync: (since) => dispatch(getLogEntriesAsync(since)),
  cleanRecentLogEntriesAsync: () => dispatch(cleanRecentLogEntriesAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
