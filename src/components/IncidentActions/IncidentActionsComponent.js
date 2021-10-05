/* eslint-disable camelcase */

import { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import {
  Container,
  Badge,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownButton,
  ButtonGroup,
} from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import './IncidentActionsComponent.css';

import {
  acknowledge,
  escalate,
  toggleDisplayReassignModal,
  toggleDisplayAddResponderModal,
  snooze,
  toggleDisplayCustomSnoozeModal,
  resolve,
  updatePriority,
  toggleDisplayAddNoteModal,
  runCustomIncidentAction,
  syncWithExternalSystem,
} from 'redux/incident_actions/actions';

import { runResponsePlayAsync } from 'redux/response_plays/actions';

import {
  TRIGGERED,
  ACKNOWLEDGED,
  RESOLVED,
  SNOOZE_TIMES,
  filterIncidentsByField,
  HIGH,
} from 'util/incidents';

import { CUSTOM_INCIDENT_ACTION, EXTERNAL_SYSTEM } from 'util/extensions';

import { getObjectsFromListbyKey } from 'util/helpers';

const animatedComponents = makeAnimated();

const IncidentActionsComponent = ({
  incidentTableSettings,
  incidentActions,
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
  resolve,
  updatePriority,
  toggleDisplayAddNoteModal,
  runCustomIncidentAction,
  runResponsePlayAsync,
  syncWithExternalSystem,
}) => {
  const { selectedCount, selectedRows } = incidentTableSettings;
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
  const enableEscalationAction = !(
    selectedCount === 1 &&
    highUrgencyIncidents.length &&
    selectedIncident.status !== RESOLVED
  );

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
  const selectListResponsePlays =
    responsePlays.length > 0
      ? responsePlays.map((responsePlay) => ({
        label: responsePlay.summary,
        value: responsePlay.id,
        summary: responsePlay.summary,
        id: responsePlay.id,
      }))
      : [];

  // Generate extension types per selected incident's service
  const { serviceExtensionMap } = extensions;
  const serviceExtensions = selectedIncident
    ? serviceExtensionMap[selectedIncident.service.id]
    : [];
  const customIncidentActions =
    serviceExtensions.length > 0
      ? serviceExtensions.filter(
        (serviceExtension) => serviceExtension.extension_type === CUSTOM_INCIDENT_ACTION,
      )
      : [];
  const externalSystemsTemp =
    serviceExtensions.length > 0
      ? serviceExtensions.filter(
        (serviceExtension) => serviceExtension.extension_type === EXTERNAL_SYSTEM,
      )
      : [];

  // Identify extensions (ext systems) that have already been sync'd with on the selected incident
  // NB - need intermediate variables to stop race condition of empty array
  const externalSystems = selectedIncident
    ? externalSystemsTemp.map((serviceExtension) => {
      const tempServiceExtension = { ...serviceExtension };
      let result;
      result = selectedIncident.external_references
        ? selectedIncident.external_references.find(
          ({ webhook }) => webhook.id === serviceExtension.id,
        )
        : null;
      if (result) {
        tempServiceExtension.synced = true;
        tempServiceExtension.extension_label = `Synced with ${result.webhook.summary} (${result.external_id})`;
      } else {
        tempServiceExtension.synced = false;
      }
      return tempServiceExtension;
    })
    : [];

  return (
    <div>
      <Container className="incident-actions-ctr" fluid>
        <Row>
          <Col sm={{ span: -1 }}>
            <div className="selected-incidents-ctr">
              <h4>
                <Badge
                  className="selected-incidents-badge"
                  variant="primary"
                >
                  {selectedCount}
                </Badge>
              </h4>
              <p className="selected-incidents">
                Selected
              </p>
            </div>
          </Col>
          <Col>
            <Button
              className="action-button"
              variant="outline-dark"
              onClick={() => acknowledge(selectedRows)}
              disabled={enableActions}
            >
              Acknowledge
            </Button>
            <DropdownButton
              as={ButtonGroup}
              className="action-button"
              variant="outline-dark"
              drop="up"
              title="Escalate"
              disabled={enableEscalationAction}
              show={displayEscalate}
              onClick={() => toggleEscalate(!displayEscalate)}
            >
              {selectedEscalationRules.map((escalation_rule, idx) => {
                const escalationLevel = selectedEscalationRules.length - idx;
                return (
                  <Dropdown.Item
                    key={escalation_rule.id}
                    variant="outline-dark"
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
              variant="outline-dark"
              onClick={() => toggleDisplayReassignModal()}
              disabled={enableActions}
            >
              Reassign
            </Button>
            <Button
              className="action-button"
              variant="outline-dark"
              onClick={() => toggleDisplayAddResponderModal()}
              disabled={enableActions}
            >
              Add Responders
            </Button>
            <DropdownButton
              as={ButtonGroup}
              className="action-button"
              variant="outline-dark"
              drop="up"
              title="Snooze"
              disabled={enableActions}
              show={displaySnooze}
              onClick={() => toggleSnooze(!displaySnooze)}
            >
              {Object.keys(SNOOZE_TIMES).map((duration) => (
                <Dropdown.Item
                  key={duration}
                  variant="outline-dark"
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
              variant="outline-dark"
              disabled={enableActions}
              onClick={() => resolve(selectedRows)}
            >
              Resolve
            </Button>
          </Col>
          <Col sm={{ span: 3.5 }}>
            <DropdownButton
              as={ButtonGroup}
              className="action-button"
              variant="outline-dark"
              drop="up"
              title="Update Priority"
              disabled={enableActions}
              show={displayPriority}
              onClick={() => togglePriority(!displayPriority)}
            >
              {priorities.map((priority) => (
                <Dropdown.Item
                  key={priority.id}
                  variant="outline-dark"
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
              variant="outline-dark"
              onClick={() => toggleDisplayAddNoteModal()}
              disabled={enablePostActions}
            >
              Add Note
            </Button>
            <DropdownButton
              as={ButtonGroup}
              className="action-button"
              variant="outline-dark"
              drop="up"
              title="Run Action"
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
  incidentTableSettings: state.incidentTableSettings,
  incidentActions: state.incidentActions,
  priorities: state.priorities.priorities,
  escalationPolicies: state.escalationPolicies.escalationPolicies,
  extensions: state.extensions,
  responsePlays: state.responsePlays.responsePlays,
});

const mapDispatchToProps = (dispatch) => ({
  acknowledge: (incidents) => dispatch(acknowledge(incidents)),
  escalate: (incidents, escalationLevel) => dispatch(escalate(incidents, escalationLevel)),
  toggleDisplayReassignModal: () => dispatch(toggleDisplayReassignModal()),
  toggleDisplayAddResponderModal: () => dispatch(toggleDisplayAddResponderModal()),
  snooze: (incidents, duration) => dispatch(snooze(incidents, duration)),
  toggleDisplayCustomSnoozeModal: () => dispatch(toggleDisplayCustomSnoozeModal()),
  resolve: (incidents) => dispatch(resolve(incidents)),
  updatePriority: (incidents, priorityId) => dispatch(updatePriority(incidents, priorityId)),
  toggleDisplayAddNoteModal: () => dispatch(toggleDisplayAddNoteModal()),
  runCustomIncidentAction: (incidents, webhook) => dispatch(runCustomIncidentAction(incidents, webhook)),
  runResponsePlayAsync: (incidents, responsePlay) => dispatch(runResponsePlayAsync(incidents, responsePlay)),
  syncWithExternalSystem: (incidents, webhook) => dispatch(syncWithExternalSystem(incidents, webhook)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentActionsComponent);
