import {
  useEffect,
} from 'react';
import {
  connect,
} from 'react-redux';
import {
  Container,
} from 'react-bootstrap';
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
import AddStatusUpdateModalComponent from 'components/AddStatusUpdateModal/AddStatusUpdateModalComponent';
import ReassignModalComponent from 'components/ReassignModal/ReassignModalComponent';
import AddResponderModalComponent from 'components/AddResponderModal/AddResponderModalComponent';
import MergeModalComponent from 'components/MergeModal/MergeModalComponent';

import {
  getIncidentsAsync as getIncidentsAsyncConnected,
  getAllIncidentNotesAsync as getAllIncidentNotesAsyncConnected,
} from 'redux/incidents/actions';
import {
  getLogEntriesAsync as getLogEntriesAsyncConnected,
  cleanRecentLogEntriesAsync as cleanRecentLogEntriesAsyncConnected,
} from 'redux/log_entries/actions';
import {
  getServicesAsync as getServicesAsyncConnected,
} from 'redux/services/actions';
import {
  getTeamsAsync as getTeamsAsyncConnected,
} from 'redux/teams/actions';
import {
  getPrioritiesAsync as getPrioritiesAsyncConnected,
} from 'redux/priorities/actions';
import {
  userAuthorize as userAuthorizeConnected,
  getUsersAsync as getUsersAsyncConnected,
} from 'redux/users/actions';
import {
  getEscalationPoliciesAsync as getEscalationPoliciesAsyncConnected,
} from 'redux/escalation_policies/actions';
import {
  getExtensionsAsync as getExtensionsAsyncConnected,
} from 'redux/extensions/actions';
import {
  getResponsePlaysAsync as getResponsePlaysAsyncConnected,
} from 'redux/response_plays/actions';
import {
  checkConnectionStatus as checkConnectionStatusConnected,
  checkAbilities as checkAbilitiesConnected,
} from 'redux/connection/actions';
import {
  startMonitoring as startMonitoringConnected,
} from 'redux/monitoring/actions';
import {
  store,
} from 'redux/store';

import {
  getLanguage,
} from 'util/helpers';

import {
  PD_REQUIRED_ABILITY,
  LOG_ENTRIES_POLLING_INTERVAL_SECONDS,
  LOG_ENTRIES_CLEARING_INTERVAL_SECONDS,
} from 'config/constants';

import 'App.scss';
import 'moment/min/locales.min';

moment.locale(getLanguage());

const App = ({
  state,
  startMonitoring,
  userAuthorize,
  checkAbilities,
  checkConnectionStatus,
  getServicesAsync,
  getTeamsAsync,
  getPrioritiesAsync,
  getUsersAsync,
  getEscalationPoliciesAsync,
  getExtensionsAsync,
  getResponsePlaysAsync,
  getIncidentsAsync,
  getAllIncidentNotesAsync,
  getLogEntriesAsync,
  cleanRecentLogEntriesAsync,
}) => {
  // Verify if session token is present
  const token = sessionStorage.getItem('pd_access_token');
  if (!token) {
    return null;
  }

  // Begin monitoring and load core objects from API
  const {
    userAuthorized, userAcceptedDisclaimer,
  } = state.users;
  useEffect(() => {
    userAuthorize();
    if (userAuthorized) {
      startMonitoring();
      checkAbilities();
      getUsersAsync();
      getServicesAsync();
      getTeamsAsync();
      getEscalationPoliciesAsync();
      getExtensionsAsync();
      getResponsePlaysAsync();
      getPrioritiesAsync();
      getIncidentsAsync();
      getAllIncidentNotesAsync();
      checkConnectionStatus();
    }
  }, [userAuthorized]);

  // Setup log entry polling
  useEffect(() => {
    const pollingInterval = setInterval(() => {
      checkAbilities();
      checkConnectionStatus();
      const {
        abilities,
      } = store.getState().connection;
      if (userAuthorized && abilities.includes(PD_REQUIRED_ABILITY)) {
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
        <AddStatusUpdateModalComponent />
        <ReassignModalComponent />
        <AddResponderModalComponent />
        <MergeModalComponent />
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });

const mapDispatchToProps = (dispatch) => ({
  startMonitoring: () => dispatch(startMonitoringConnected()),
  userAuthorize: () => dispatch(userAuthorizeConnected()),
  checkAbilities: () => dispatch(checkAbilitiesConnected()),
  checkConnectionStatus: () => dispatch(checkConnectionStatusConnected()),
  getServicesAsync: (teamIds) => dispatch(getServicesAsyncConnected(teamIds)),
  getTeamsAsync: () => dispatch(getTeamsAsyncConnected()),
  getPrioritiesAsync: () => dispatch(getPrioritiesAsyncConnected()),
  getUsersAsync: () => dispatch(getUsersAsyncConnected()),
  getEscalationPoliciesAsync: () => dispatch(getEscalationPoliciesAsyncConnected()),
  getExtensionsAsync: () => dispatch(getExtensionsAsyncConnected()),
  getResponsePlaysAsync: () => dispatch(getResponsePlaysAsyncConnected()),
  getIncidentsAsync: () => dispatch(getIncidentsAsyncConnected()),
  getAllIncidentNotesAsync: () => dispatch(getAllIncidentNotesAsyncConnected()),
  getLogEntriesAsync: (since) => dispatch(getLogEntriesAsyncConnected(since)),
  cleanRecentLogEntriesAsync: () => dispatch(cleanRecentLogEntriesAsyncConnected()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
