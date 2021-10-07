import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';

import PDOAuth from 'util/pdoauth';

import moment from 'moment';

import NavigationBarComponent from 'components/NavigationBar/NavigationBarComponent';
import QuerySettingsComponent from 'components/QuerySettings/QuerySettingsComponent';
import IncidentTableSettingsComponent from 'components/IncidentTable/IncidentTableSettingsComponent';
import IncidentTableComponent from 'components/IncidentTable/IncidentTableComponent';
import IncidentActionsComponent from 'components/IncidentActions/IncidentActionsComponent';
import ActionAlertsModalComponent from 'components/ActionAlertsModal/ActionAlertsModalComponent';
import CustomSnoozeModalComponent from 'components/CustomSnoozeModal/CustomSnoozeModalComponent';
import AddNoteModalComponent from 'components/AddNoteModal/AddNoteModalComponent';
import ReassignModalComponent from 'components/ReassignModal/ReassignModalComponent';
import AddResponderModalComponent from 'components/AddResponderModal/AddResponderModalComponent';

import { getIncidentsAsync } from 'redux/incidents/actions';
import { getLogEntriesAsync, cleanRecentLogEntriesAsync } from 'redux/log_entries/actions';
import { getServicesAsync } from 'redux/services/actions';
import { getTeamsAsync } from 'redux/teams/actions';
import { getPrioritiesAsync } from 'redux/priorities/actions';
import { getUsersAsync, getCurrentUserAsync } from 'redux/users/actions';
import { getEscalationPoliciesAsync } from 'redux/escalation_policies/actions';
import { getExtensionsAsync } from 'redux/extensions/actions';
import { getResponsePlaysAsync } from 'redux/response_plays/actions';

import 'App.css';

const App = ({
  getServicesAsync,
  getTeamsAsync,
  getPrioritiesAsync,
  getUsersAsync,
  getCurrentUserAsync,
  getEscalationPoliciesAsync,
  getExtensionsAsync,
  getResponsePlaysAsync,
  getIncidentsAsync,
  getLogEntriesAsync,
  cleanRecentLogEntriesAsync,
}) => {
  // Verify OAuth Session
  useEffect(() => {
    const token = sessionStorage.getItem('pd_access_token');
    if (!token) {
      PDOAuth.login('b0770bc5-8649-4f60-9b16-1ba9360e2a82');
    }
  }, []);

  const token = sessionStorage.getItem('pd_access_token');
  if (!token) {
    return null;
  }

  // Initial load of objects from API
  useEffect(() => {
    getUsersAsync();
    getCurrentUserAsync();
    getServicesAsync();
    getTeamsAsync();
    getPrioritiesAsync();
    getEscalationPoliciesAsync();
    getExtensionsAsync();
    getResponsePlaysAsync();
    getIncidentsAsync();
  }, []);

  // Setup log entry polling.
  useEffect(() => {
    const pollingIntervalSeconds = 5;
    const pollingInterval = setInterval(() => {
      const lastPolledDate = moment()
        .subtract(2 * pollingIntervalSeconds, 'seconds')
        .toDate();
      getLogEntriesAsync(lastPolledDate);
    }, pollingIntervalSeconds * 1000);
    return () => clearInterval(pollingInterval);
  }, []);

  // Setup log entry clearing
  useEffect(() => {
    const clearingIntervalSeconds = 600;
    const clearingInterval = setInterval(() => {
      cleanRecentLogEntriesAsync();
    }, clearingIntervalSeconds * 1000);
    return () => clearInterval(clearingInterval);
  }, []);

  return (
    <div className="App">
      <NavigationBarComponent />
      <Container fluid>
        <QuerySettingsComponent />
        <IncidentTableComponent />
        <IncidentTableSettingsComponent />
        <IncidentActionsComponent />
        <ActionAlertsModalComponent />
        <CustomSnoozeModalComponent />
        <AddNoteModalComponent />
        <ReassignModalComponent />
        <AddResponderModalComponent />
      </Container>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getServicesAsync: (teamIds) => dispatch(getServicesAsync(teamIds)),
  getTeamsAsync: () => dispatch(getTeamsAsync()),
  getPrioritiesAsync: () => dispatch(getPrioritiesAsync()),
  getUsersAsync: () => dispatch(getUsersAsync()),
  getCurrentUserAsync: () => dispatch(getCurrentUserAsync()),
  getEscalationPoliciesAsync: () => dispatch(getEscalationPoliciesAsync()),
  getExtensionsAsync: () => dispatch(getExtensionsAsync()),
  getResponsePlaysAsync: () => dispatch(getResponsePlaysAsync()),
  getIncidentsAsync: () => dispatch(getIncidentsAsync()),
  getLogEntriesAsync: (since) => dispatch(getLogEntriesAsync(since)),
  cleanRecentLogEntriesAsync: () => dispatch(cleanRecentLogEntriesAsync()),
});

export default connect(null, mapDispatchToProps)(App);
