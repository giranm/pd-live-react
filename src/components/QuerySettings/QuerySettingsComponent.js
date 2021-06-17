import { connect } from "react-redux";

import { Row, Col, Button, ToggleButton, ToggleButtonGroup, Form, Card, Accordion } from 'react-bootstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const QuerySettingsComponent = ({ querySettings, services, updateQuerySettings }) => {
  let { displayQuerySettings } = querySettings;
  let eventKey = displayQuerySettings ? "0" : "1"

  let selectListServices = services.map(service => {
    return {
      label: service.name,
      value: service.id
    }
  })

  return (
    <div className="query-settings-ctr">
      <Accordion defaultActiveKey="0">
        <Card bg="light">
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
                    <Select
                      components={animatedComponents}
                      isMulti
                      options={selectListServices}
                    />
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
  querySettings: state.querySettings,
  services: state.services.services
});

const mapDispatchToProps = (dispatch) => ({
  updateQuerySettings: (params) => () => { }, // To be implemented as action
});

export default connect(mapStateToProps, mapDispatchToProps)(QuerySettingsComponent);