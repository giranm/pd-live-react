/* eslint-disable camelcase */

import {
  useState, useEffect,
} from 'react';
import {
  connect,
} from 'react-redux';

import {
  Container,
  Badge,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  Spinner,
} from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import {
  FontAwesomeIcon,
} from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faLevelUpAlt,
  faExchangeAlt,
  faUserPlus,
  faClock,
  faCheckCircle,
  faExclamation,
  faEdit,
  faPlay,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';

import './IncidentActionsComponent.scss';

import {
  acknowledge as acknowledgeConnected,
  escalate as escalateConnected,
  toggleDisplayReassignModal as toggleDisplayReassignModalConnected,
  toggleDisplayAddResponderModal as toggleDisplayAddResponderModalConnected,
  snooze as snoozeConnected,
  toggleDisplayCustomSnoozeModal as toggleDisplayCustomSnoozeModalConnected,
  toggleDisplayMergeModal as toggleDisplayMergeModalConnected,
  resolve as resolveConnected,
  updatePriority as updatePriorityConnected,
  toggleDisplayAddNoteModal as toggleDisplayAddNoteModalConnected,
  runCustomIncidentAction as runCustomIncidentActionConnected,
  syncWithExternalSystem as syncWithExternalSystemConnected,
} from 'redux/incident_actions/actions';

import {
  runResponsePlayAsync as runResponsePlayAsyncConnected,
} from 'redux/response_plays/actions';

import {
  TRIGGERED,
  ACKNOWLEDGED,
  RESOLVED,
  SNOOZE_TIMES,
  filterIncidentsByField,
  HIGH,
} from 'util/incidents';

import {
  CUSTOM_INCIDENT_ACTION, EXTERNAL_SYSTEM,
} from 'util/extensions';

import {
  getObjectsFromListbyKey,
} from 'util/helpers';

const animatedComponents = makeAnimated();

const IncidentActionsComponent = ({
  incidentTable,
  incidents,
  priorities,
  escalationPolicies,
  extensions,
  responsePlays,
  acknowledge,
  escalate,
  toggleDisplayReassignModal,
  toggleDisplayAddResponderModal,
  snooze,
  toggleDisplayCustomSnoozeModal,
  toggleDisplayMergeModal,
  resolve,
  updatePriority,
  toggleDisplayAddNoteModal,
  runCustomIncidentAction,
  runResponsePlayAsync,
  syncWithExternalSystem,
}) => {
  const {
    fetchingIncidents, filteredIncidentsByQuery,
  } = incidents;
  const {
    selectedCount, selectedRows,
  } = incidentTable;
  const resolvedIncidents = filterIncidentsByField(selectedRows, 'status', [RESOLVED]);
  const unresolvedIncidents = filterIncidentsByField(selectedRows, 'status', [
    TRIGGERED,
    ACKNOWLEDGED,
  ]);
  const highUrgencyIncidents = filterIncidentsByField(selectedRows, 'urgency', [HIGH]);

  // Determine ability of each button based on selected items
  const selectedIncident = selectedCount === 1 ? selectedRows[0] : null;
  const enableActions = !(unresolvedIncidents.length > 0);
  const enablePostActions = !(selectedCount > 0);
  const enablePostSingularAction = selectedCount !== 1;
  const enableMergeAction = !(
    !enableActions
    && selectedCount > 1
    && resolvedIncidents.length === 0
  );
  const enableEscalationAction = !(
    selectedCount === 1
    && highUrgencyIncidents.length
    && selectedIncident.status !== RESOLVED
  );
  const enablePriorityAction = !(selectedCount >= 1);

  // Create internal variables and state for escalate
  const selectedEscalationPolicyId = selectedIncident ? selectedRows[0].escalation_policy.id : null;
  const selectedEscalationPolicy = getObjectsFromListbyKey(
    escalationPolicies,
    'id',
    selectedEscalationPolicyId,
  )[0];
  const selectedEscalationRules = selectedEscalationPolicy
    ? selectedEscalationPolicy.escalation_rules.slice(0).reverse()
    : [];

  const [displayEscalate, toggleEscalate] = useState(false);
  useEffect(() => {
    toggleEscalate(false);
  }, [enableEscalationAction]);

  // Create internal state for snooze - disable toggle irrespective of actions
  const [displaySnooze, toggleSnooze] = useState(false);
  useEffect(() => {
    toggleSnooze(false);
  }, [enableActions]);

  // Create internal state for priorities
  const [displayPriority, togglePriority] = useState(false);
  useEffect(() => {
    togglePriority(false);
  }, [enableActions]);

  // Create internal state for run actions
  const [displayRunActions, toggleRunActions] = useState(false);
  useEffect(() => {
    toggleRunActions(false);
  }, [enablePostSingularAction]);

  // Generate selection list for response plays per selected incident
  const selectListResponsePlays = responsePlays.length > 0
    ? responsePlays.map((responsePlay) => ({
      label: responsePlay.summary,
      value: responsePlay.id,
      summary: responsePlay.summary,
      id: responsePlay.id,
    }))
    : [];

  // Generate extension types per selected incident's service
  const {
    serviceExtensionMap,
  } = extensions;
  const serviceExtensions = selectedIncident
    ? serviceExtensionMap[selectedIncident.service.id]
    : [];
  const customIncidentActions = serviceExtensions
    ? serviceExtensions.filter(
      (serviceExtension) => serviceExtension.extension_type === CUSTOM_INCIDENT_ACTION,
    )
    : [];
  const externalSystemsTemp = serviceExtensions
    ? serviceExtensions.filter(
      (serviceExtension) => serviceExtension.extension_type === EXTERNAL_SYSTEM,
    )
    : [];

  // Identify extensions (ext systems) that have already been sync'd with on the selected incident
  // NB - need intermediate variables to stop race condition of empty array
  const [externalSystems, setExternalSystems] = useState([]);
  useEffect(() => {
    const tempExternalSystems = selectedIncident
      ? externalSystemsTemp.map((serviceExtension) => {
        const tempServiceExtension = { ...serviceExtension };
        const result = selectedIncident.external_references
          ? selectedIncident.external_references.find(
            ({
              webhook,
            }) => webhook.id === serviceExtension.id,
          )
          : null;
        if (result) {
          tempServiceExtension.synced = true;
          tempServiceExtension.extension_label = `Synced with
            ${result.webhook.summary} (${result.external_id})`;
        } else {
          tempServiceExtension.synced = false;
        }
        return tempServiceExtension;
      })
      : [];
    setExternalSystems(tempExternalSystems);
  }, [displayRunActions, selectedIncident]);

  return (
    <div>
      <Container className="incident-actions-ctr" id="incident-actions-ctr" fluid>
        <Row>
          <Col sm={{ span: -1 }}>
            <div className="selected-incidents-ctr">
              {fetchingIncidents ? (
                <>
                  <Spinner animation="border" variant="success" />
                  <p className="selected-incidents">Querying</p>
                </>
              ) : (
                <>
                  <h4>
                    <Badge
                      className="selected-incidents-badge"
                      variant={filteredIncidentsByQuery.length ? 'primary' : 'secondary'}
                    >
                      {`${selectedCount}/${filteredIncidentsByQuery.length}`}
                    </Badge>
                  </h4>
                  <p className="selected-incidents">Selected</p>
                </>
              )}
            </div>
          </Col>
          <Col>
            <Button
              id="incident-action-acknowledge-button"
              className="action-button"
              variant={enableActions ? 'outline-secondary' : 'light'}
              onClick={() => acknowledge(selectedRows)}
              disabled={enableActions}
            >
              <div className="action-icon">
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              Acknowledge
            </Button>
            <DropdownButton
              as={ButtonGroup}
              className="action-button"
              variant={enableEscalationAction ? 'outline-secondary' : 'light'}
              drop="up"
              title={(
                <>
                  <div className="action-icon">
                    <FontAwesomeIcon icon={faLevelUpAlt} />
                  </div>
                  Escalate
                </>
              )}
              disabled={enableEscalationAction}
              onClick={() => toggleEscalate(!displayEscalate)}
            >
              {selectedEscalationRules.map((escalation_rule, idx) => {
                const escalationLevel = selectedEscalationRules.length - idx;
                return (
                  <Dropdown.Item
                    key={escalation_rule.id}
                    variant="light"
                    onClick={() => escalate(selectedRows, escalationLevel)}
                  >
                    {`Level ${escalationLevel}: ${escalation_rule.targets
                      .map((t) => t.summary)
                      .join(', ')}`}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
            <Button
              className="action-button"
              variant={enableActions ? 'outline-secondary' : 'light'}
              onClick={() => toggleDisplayReassignModal()}
              disabled={enableActions}
            >
              <div className="action-icon">
                <FontAwesomeIcon icon={faExchangeAlt} />
              </div>
              Reassign
            </Button>
            <Button
              className="action-button"
              variant={enableActions ? 'outline-secondary' : 'light'}
              onClick={() => toggleDisplayAddResponderModal()}
              disabled={enableActions}
            >
              <div className="action-icon">
                <FontAwesomeIcon icon={faUserPlus} />
              </div>
              Add Responders
            </Button>
            <DropdownButton
              as={ButtonGroup}
              className="action-button"
              variant={enableActions ? 'outline-secondary' : 'light'}
              drop="up"
              title={(
                <>
                  <div className="action-icon">
                    <FontAwesomeIcon icon={faClock} />
                  </div>
                  Snooze
                </>
              )}
              disabled={enableActions}
              onClick={() => toggleSnooze(!displaySnooze)}
            >
              {Object.keys(SNOOZE_TIMES).map((duration) => (
                <Dropdown.Item
                  key={duration}
                  variant="light"
                  onClick={() => snooze(selectedRows, duration)}
                >
                  {duration}
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => toggleDisplayCustomSnoozeModal()}>Custom</Dropdown.Item>
            </DropdownButton>
            <Button
              className="action-button"
              variant={enableMergeAction ? 'outline-secondary' : 'light'}
              onClick={() => toggleDisplayMergeModal()}
              disabled={enableMergeAction}
            >
              <div className="action-icon">
                <FontAwesomeIcon icon={faLayerGroup} />
              </div>
              Merge
            </Button>
            <Button
              className="action-button"
              variant={enableActions ? 'outline-secondary' : 'light'}
              disabled={enableActions}
              onClick={() => resolve(selectedRows)}
            >
              <div className="action-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              Resolve
            </Button>
          </Col>
          <Col sm={{ span: 3.5 }}>
            <DropdownButton
              as={ButtonGroup}
              className="action-button"
              variant={enablePriorityAction ? 'outline-secondary' : 'light'}
              drop="up"
              title={(
                <>
                  <div className="action-icon">
                    <FontAwesomeIcon icon={faExclamation} />
                  </div>
                  Update Priority
                </>
              )}
              disabled={enablePriorityAction}
              onClick={() => togglePriority(!displayPriority)}
            >
              {priorities.map((priority) => (
                <Dropdown.Item
                  key={priority.id}
                  variant="light"
                  onClick={() => updatePriority(selectedRows, priority.id)}
                >
                  <p
                    style={{
                      backgroundColor: `#${priority.color}`,
                      color: 'white',
                    }}
                    className="priority-label-dropdown"
                  >
                    {priority.name}
                  </p>
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <Button
              className="action-button"
              variant={enablePostActions ? 'outline-secondary' : 'light'}
              onClick={() => toggleDisplayAddNoteModal()}
              disabled={enablePostActions}
            >
              <div className="action-icon">
                <FontAwesomeIcon icon={faEdit} />
              </div>
              Add Note
            </Button>
            <DropdownButton
              as={ButtonGroup}
              className="action-button"
              variant={enablePostSingularAction ? 'outline-secondary' : 'light'}
              drop="up"
              title={(
                <>
                  <div className="action-icon">
                    <FontAwesomeIcon icon={faPlay} />
                  </div>
                  Run Action
                </>
              )}
              align="end"
              id="run-action"
              disabled={enablePostSingularAction}
              show={displayRunActions}
              onClick={(e) => {
                if (e.target.id === 'run-action') toggleRunActions(!displayRunActions);
              }}
            >
              {selectListResponsePlays.length > 0 ? (
                <>
                  <Dropdown.Header>Response Plays</Dropdown.Header>
                  <Dropdown.Item>
                    <Select
                      className="response-play-dropdown"
                      menuPlacement="top"
                      components={animatedComponents}
                      options={selectListResponsePlays}
                      onChange={(selectedResponsePlay) => {
                        runResponsePlayAsync(selectedRows, selectedResponsePlay);
                        toggleRunActions(!displayRunActions);
                      }}
                    />
                  </Dropdown.Item>
                  <Dropdown.Divider />
                </>
              ) : (
                <></>
              )}
              {customIncidentActions.length > 0 ? (
                <>
                  <Dropdown.Header>Actions</Dropdown.Header>
                  {customIncidentActions.map((customIncidentAction) => (
                    <Dropdown.Item
                      key={customIncidentAction.id}
                      onClick={() => {
                        runCustomIncidentAction(selectedRows, customIncidentAction);
                        toggleRunActions(!displayRunActions);
                      }}
                    >
                      {customIncidentAction.name}
                    </Dropdown.Item>
                  ))}
                  <Dropdown.Divider />
                </>
              ) : (
                <></>
              )}
              {externalSystems.length > 0 ? (
                <>
                  <Dropdown.Header>External Systems</Dropdown.Header>
                  {externalSystems.map((externalSystem) => (
                    <Dropdown.Item
                      key={externalSystem.id}
                      disabled={externalSystem.synced}
                      onClick={() => {
                        syncWithExternalSystem(selectedRows, externalSystem);
                        toggleRunActions(!displayRunActions);
                      }}
                    >
                      {externalSystem.extension_label}
                    </Dropdown.Item>
                  ))}
                  <Dropdown.Divider />
                </>
              ) : (
                <></>
              )}
            </DropdownButton>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({
  incidentTable: state.incidentTable,
  incidents: state.incidents,
  priorities: state.priorities.priorities,
  escalationPolicies: state.escalationPolicies.escalationPolicies,
  extensions: state.extensions,
  responsePlays: state.responsePlays.responsePlays,
});

const mapDispatchToProps = (dispatch) => ({
  acknowledge: (incidents) => dispatch(acknowledgeConnected(incidents)),
  escalate: (incidents, escalationLevel) => dispatch(escalateConnected(incidents, escalationLevel)),
  toggleDisplayReassignModal: () => dispatch(toggleDisplayReassignModalConnected()),
  toggleDisplayAddResponderModal: () => dispatch(toggleDisplayAddResponderModalConnected()),
  snooze: (incidents, duration) => dispatch(snoozeConnected(incidents, duration)),
  toggleDisplayCustomSnoozeModal: () => dispatch(toggleDisplayCustomSnoozeModalConnected()),
  toggleDisplayMergeModal: () => dispatch(toggleDisplayMergeModalConnected()),
  resolve: (incidents) => dispatch(resolveConnected(incidents)),
  updatePriority: (incidents, priorityId) => {
    dispatch(updatePriorityConnected(incidents, priorityId));
  },
  toggleDisplayAddNoteModal: () => dispatch(toggleDisplayAddNoteModalConnected()),
  runCustomIncidentAction: (incidents, webhook) => {
    dispatch(runCustomIncidentActionConnected(incidents, webhook));
  },
  runResponsePlayAsync: (incidents, responsePlay) => {
    dispatch(runResponsePlayAsyncConnected(incidents, responsePlay));
  },
  syncWithExternalSystem: (incidents, webhook) => {
    dispatch(syncWithExternalSystemConnected(incidents, webhook));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentActionsComponent);
