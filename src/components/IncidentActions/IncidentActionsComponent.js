import { connect } from "react-redux";

import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownButton,
  ButtonGroup
} from 'react-bootstrap';

import "./IncidentActionsComponent.css";

import {
  acknowledge,
  snooze,
  resolve
} from "redux/incident_actions/actions";

import {
  TRIGGERED,
  ACKNOWLEDGED,
  RESOLVED,
  SNOOZE_TIMES,
  filterIncidentsByField
} from "util/incidents";

const IncidentActionsComponent = ({
  incidentTableSettings,
  incidentActions,
  acknowledge,
  escalate,
  reassign,
  addResponders,
  snooze,
  resolve,
  updatePriority,
  addNote,
  runAction
}) => {

  let { selectedCount, selectedRows } = incidentTableSettings;
  let triggeredIncidents = filterIncidentsByField(selectedRows, "status", [TRIGGERED]);
  let acknowledgedIncidents = filterIncidentsByField(selectedRows, "status", [ACKNOWLEDGED]);
  let resolvedIncidents = filterIncidentsByField(selectedRows, "status", [RESOLVED]);

  // Determine ability of each button based on selected items
  let enableActions = triggeredIncidents.length > 0 || acknowledgedIncidents.length > 0 ? false : true;
  let enablePostActions = selectedCount > 0 ? false : true;

  return (
    <div>
      <Container className="incident-actions-ctr" fluid>
        <Row>
          <Col>
            <Button
              className="action-button"
              variant="outline-dark"
              onClick={() => acknowledge(selectedRows)}
              disabled={enableActions}
            >
              Acknowledge
            </Button>
            <Button
              className="action-button"
              variant="outline-dark"
              disabled={enableActions}
            >
              Escalate
            </Button>
            <Button
              className="action-button"
              variant="outline-dark"
              disabled={enableActions}
            >
              Reassign
            </Button>
            <Button
              className="action-button"
              variant="outline-dark"
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
            >
              {Object.keys(SNOOZE_TIMES).map(duration =>
                <Dropdown.Item
                  key={duration}
                  variant="outline-dark"
                  onClick={() => snooze(selectedRows, duration)}
                >
                  {duration}
                </Dropdown.Item>
              )}
              <Dropdown.Divider />
              {/* TODO: Render custom duration modal here */}
              <Dropdown.Item>Custom</Dropdown.Item>
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
          <Col sm={{ span: 3 }}>
            <Button
              className="action-button"
              variant="outline-dark"
              disabled={enablePostActions}
            >
              Update Priority
            </Button>
            <Button
              className="action-button"
              variant="outline-dark"
              disabled={enablePostActions}
            >
              Add Note
            </Button>
            <Button
              className="action-button"
              variant="outline-dark"
              disabled={enablePostActions}
            >
              Run Action
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const mapStateToProps = (state) => ({
  incidentTableSettings: state.incidentTableSettings,
  incidentActions: state.incidentActions,
});

const mapDispatchToProps = (dispatch) => ({
  acknowledge: (incidents) => dispatch(acknowledge(incidents)),
  escalate: (incidents) => () => { }, // To be implemented as action
  reassign: (incidents) => () => { }, // To be implemented as action
  addResponders: (incidents) => () => { }, // To be implemented as action
  snooze: (incidents, duration) => dispatch(snooze(incidents, duration)),
  resolve: (incidents) => dispatch(resolve(incidents)),
  updatePriority: (incidents) => () => { }, // To be implemented as action
  addNote: (incidents) => () => { }, // To be implemented as action
  runAction: (incidents) => () => { }, // To be implemented as action
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentActionsComponent);