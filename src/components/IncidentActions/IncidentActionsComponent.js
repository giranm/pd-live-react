import { connect } from "react-redux";

import { Container, Row, Col, Button } from 'react-bootstrap';

import "./IncidentActionsComponent.css";

const IncidentActionsComponent = ({
  incidentActionSettings,
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
  return (
    <div>
      <Container className="incident-actions-ctr" fluid>
        <Row>
          <Col>
            <Button className="action-button" variant="outline-dark">Acknowledge</Button>
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
  incidentActionSettings: null // To be added to store
});

const mapDispatchToProps = (dispatch) => ({
  acknowledge: () => () => { }, // To be implemented as action
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