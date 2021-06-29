import { connect } from "react-redux";

import { Container, Row, Col, Button } from 'react-bootstrap';

import "./IncidentActionsComponent.css";

import {
  acknowledge
} from "redux/incident_actions/actions";

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

  // TODO: Create helper function to determine what buttons should be enabled/disabled from selectedRows

  return (
    <div>
      <Container className="incident-actions-ctr" fluid>
        <Row>
          <Col>
            <Button className="action-button" variant="outline-dark" onClick={() => acknowledge(selectedRows)}>
              Acknowledge
            </Button>
            <Button className="action-button" variant="outline-dark">Escalate</Button>
            <Button className="action-button" variant="outline-dark">Reassign</Button>
            <Button className="action-button" variant="outline-dark">Add Responders</Button>
            <Button className="action-button" variant="outline-dark">Snooze</Button>
            <Button className="action-button" variant="outline-dark">Resolve</Button>
          </Col>
          <Col sm={{ span: 3 }}>
            <Button className="action-button" variant="outline-dark">Update Priority</Button>
            <Button className="action-button" variant="outline-dark">Add Note</Button>
            <Button className="action-button" variant="outline-dark">Run Action</Button>
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
  acknowledge: (incidents) => dispatch(acknowledge(incidents)), // To be implemented as action
  escalate: () => () => { }, // To be implemented as action
  reassign: (params) => () => { }, // To be implemented as action
  addResponders: (params) => () => { }, // To be implemented as action
  snooze: (params) => () => { }, // To be implemented as action
  resolve: (params) => () => { }, // To be implemented as action
  updatePriority: (params) => () => { }, // To be implemented as action
  addNote: (params) => () => { }, // To be implemented as action
  runAction: (params) => () => { }, // To be implemented as action
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentActionsComponent);