import { connect } from "react-redux";

import { Row, Col, Button, ToggleButton, ToggleButtonGroup, Form, Card, Accordion } from 'react-bootstrap';
import Select from 'react-select'

const QuerySettingsComponent = ({ querySettings, updateQuerySettings }) => {
  let showQuerySettings = true; // To come from store
  let eventKey = showQuerySettings ? "0" : "1"
  return (
    <div className="query-settings-ctr">
      <Accordion defaultActiveKey="0">
        <Card bg="light">
          <Card.Header>
            <Accordion.Toggle as={Button} variant="outline-dark" eventKey="0">
              Incident Query Settings
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={eventKey}>
            <Card.Body>
              <Row>
                <Col xs="auto">
                  Since:
                  <Form.Control className="mb-2" type="date" name='since' />
                </Col>
                <Col xs="auto">
                  State: {' '}
                  <Form.Group>
                    <ToggleButtonGroup type="checkbox">
                      <ToggleButton variant="outline-dark" value={"ALL"}>All</ToggleButton>
                      <ToggleButton variant="outline-dark" value={"TRIGGERED"}>Triggered</ToggleButton>
                      <ToggleButton variant="outline-dark" value={"ACKNOWLEDGED"}>Acknowleged</ToggleButton>
                      <ToggleButton variant="outline-dark" value={"RESOLVED"}>Resolved</ToggleButton>
                    </ToggleButtonGroup>
                  </Form.Group>
                </Col>
                <Col xs="auto">
                  Urgency: {' '}
                  <Form.Group>
                    <ToggleButtonGroup type="checkbox">
                      <ToggleButton variant="outline-dark" value={"ALL"}>All</ToggleButton>
                      <ToggleButton variant="outline-dark" value={"HIGH"}>High</ToggleButton>
                      <ToggleButton variant="outline-dark" value={"LOW"}>Low</ToggleButton>
                    </ToggleButtonGroup>
                  </Form.Group>
                </Col>
                <Col>
                  Team: {' '}
                  <Form.Group>
                    <Select options={[]} />
                  </Form.Group>
                </Col>
                <Col>
                  Service: {' '}
                  <Form.Group>
                    <Select options={[]} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs="auto">
                  Until:
                  <Form.Control type="date" name='until' />
                </Col>
                <Col xs="auto">
                  Priorities: {' '}
                  <Form.Group>
                    <ToggleButtonGroup type="checkbox">
                      {/* To be generated from API */}
                      <ToggleButton variant="outline-dark" value={"P1"}>P1</ToggleButton>
                      <ToggleButton variant="outline-dark" value={"P2"}>P2</ToggleButton>
                      <ToggleButton variant="outline-dark" value={"P3"} >P3</ToggleButton>
                      <ToggleButton variant="outline-dark" value={"P4"}>P4</ToggleButton>
                      <ToggleButton variant="outline-dark" value={"P5"}>P5</ToggleButton>
                      <Button variant="outline-dark">Clear</Button>
                    </ToggleButtonGroup>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  )
}

const mapStateToProps = (state) => ({
  querySettings: null // To be added to store
});

const mapDispatchToProps = (dispatch) => ({
  updateQuerySettings: (params) => () => { }, // To be implemented as action
});

export default connect(mapStateToProps, mapDispatchToProps)(QuerySettingsComponent);