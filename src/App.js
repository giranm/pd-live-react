import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import moment from 'moment';

import UnauthorizedModalComponent from 'components/UnauthorizedModal/UnauthorizedModalComponent';
import DisclaimerModalComponent from 'components/DisclaimerModal/DisclaimerModalComponent';
import NavigationBarComponent from 'components/NavigationBar/NavigationBarComponent';
import QuerySettingsComponent from 'components/QuerySettings/QuerySettingsComponent';
import SettingsModalComponent from 'components/SettingsModal/SettingsModalComponent';
import IncidentTableComponent from 'components/IncidentTable/IncidentTableComponent';
import IncidentActionsComponent from 'components/IncidentActions/IncidentActionsComponent';
import ActionAlertsModalComponent from 'components/ActionAlertsModal/ActionAlertsModalComponent';
import CustomSnoozeModalComponent from 'components/CustomSnoozeModal/CustomSnoozeModalComponent';
import AddNoteModalComponent from 'components/AddNoteModal/AddNoteModalComponent';
import ReassignModalComponent from 'components/ReassignModal/ReassignModalComponent';
import AddResponderModalComponent from 'components/AddResponderModal/AddResponderModalComponent';
import MergeModalComponent from 'components/MergeModal/MergeModalComponent';

import { getIncidentsAsync } from 'redux/incidents/actions';
import { getLogEntriesAsync, cleanRecentLogEntriesAsync } from 'redux/log_entries/actions';
import { getServicesAsync } from 'redux/services/actions';
import { getTeamsAsync } from 'redux/teams/actions';
import { getPrioritiesAsync } from 'redux/priorities/actions';
import { userAuthorize, getUsersAsync } from 'redux/users/actions';
import { getEscalationPoliciesAsync } from 'redux/escalation_policies/actions';
import { getExtensionsAsync } from 'redux/extensions/actions';
import { getResponsePlaysAsync } from 'redux/response_plays/actions';

import { getLanguage } from 'util/helpers';
import { getPdAccessTokenObject } from 'util/pd-api-wrapper';

import {
  LOG_ENTRIES_POLLING_INTERVAL_SECONDS,
  LOG_ENTRIES_CLEARING_INTERVAL_SECONDS,
} from 'config/constants';

import 'App.scss';
import 'moment/min/locales.min';

moment.locale(getLanguage());

const App = ({
  state,
  userAuthorize,
  getServicesAsync,
  getTeamsAsync,
  getPrioritiesAsync,
  getUsersAsync,
  getEscalationPoliciesAsync,
  getExtensionsAsync,
  getResponsePlaysAsync,
  getIncidentsAsync,
  getLogEntriesAsync,
  cleanRecentLogEntriesAsync,
}) => {
  // Verify auth token via env or OAuth
  useEffect(() => {
    const { token } = getPdAccessTokenObject();
  }, []);
  const { token } = getPdAccessTokenObject();
  if (!token) {
    return null;
  }

  // Initial load of objects from API
  const { userAuthorized, userAcceptedDisclaimer } = state.users;
  useEffect(() => {
    userAuthorize();
    if (userAuthorized) {
      getUsersAsync();
      getServicesAsync();
      getTeamsAsync();
      getEscalationPoliciesAsync();
      getExtensionsAsync();
      getResponsePlaysAsync();
      getPrioritiesAsync();
      getIncidentsAsync();
    }
  }, [userAuthorized]);

  // Setup log entry polling.
  useEffect(() => {
    const pollingInterval = setInterval(() => {
      if (userAuthorized) {
        const lastPolledDate = moment()
          .subtract(2 * LOG_ENTRIES_POLLING_INTERVAL_SECONDS, 'seconds')
          .toDate();
        getLogEntriesAsync(lastPolledDate);
      }
    }, LOG_ENTRIES_POLLING_INTERVAL_SECONDS * 1000);
    return () => clearInterval(pollingInterval);
  }, [userAuthorized]);

  // Setup log entry clearing
  useEffect(() => {
    const clearingInterval = setInterval(() => {
      if (userAuthorized) {
        cleanRecentLogEntriesAsync();
      }
    }, LOG_ENTRIES_CLEARING_INTERVAL_SECONDS * 1000);
    return () => clearInterval(clearingInterval);
  }, [userAuthorized]);

  // Display disclaimer modal
  if (!userAcceptedDisclaimer) {
    return (
      <div className="App">
        <DisclaimerModalComponent />
      </div>
    );
  }

  // Display user unauthorised modal (if required)
  if (!userAuthorized) {
    return (
      <div className="App">
        <UnauthorizedModalComponent />
      </div>
    );
  }

  return (
    <div className="App">
      <NavigationBarComponent />
      <Container fluid>
        <QuerySettingsComponent />
        <IncidentTableComponent />
        <SettingsModalComponent />
        <IncidentActionsComponent />
        <ActionAlertsModalComponent />
        <CustomSnoozeModalComponent />
        <AddNoteModalComponent />
        <ReassignModalComponent />
        <AddResponderModalComponent />
        <MergeModalComponent />
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });

const mapDispatchToProps = (dispatch) => ({
  userAuthorize: () => dispatch(userAuthorize()),
  getServicesAsync: (teamIds) => dispatch(getServicesAsync(teamIds)),
  getTeamsAsync: () => dispatch(getTeamsAsync()),
  getPrioritiesAsync: () => dispatch(getPrioritiesAsync()),
  getUsersAsync: () => dispatch(getUsersAsync()),
  getEscalationPoliciesAsync: () => dispatch(getEscalationPoliciesAsync()),
  getExtensionsAsync: () => dispatch(getExtensionsAsync()),
  getResponsePlaysAsync: () => dispatch(getResponsePlaysAsync()),
  getIncidentsAsync: () => dispatch(getIncidentsAsync()),
  getLogEntriesAsync: (since) => dispatch(getLogEntriesAsync(since)),
  cleanRecentLogEntriesAsync: () => dispatch(cleanRecentLogEntriesAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
