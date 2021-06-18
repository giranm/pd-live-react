import { connect } from "react-redux";

import { Row, Col, Button, ToggleButton, ToggleButtonGroup, Form, Card, Accordion } from 'react-bootstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const QuerySettingsComponent = ({
  querySettings,
  services,
  teams,
  priorities,
  updateQuerySettings
}) => {
  let { displayQuerySettings } = querySettings;
  let eventKey = displayQuerySettings ? "0" : "1"

  let selectListServices = services.map(service => {
    return {
      label: service.name,
      value: service.id
    }
  });

  let selectListTeams = teams.map(team => {
    return {
      label: team.name,
      value: team.id
    }
  });

  let selectListPriorities = priorities.map(priority => {
    return {
      label: priority.name,
      value: priority.id
    }
  });


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
                    <Select
                      components={animatedComponents}
                      isMulti
                      options={selectListTeams}
                    />
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
                      {selectListPriorities.map(priority => {
                        return (
                          <ToggleButton key={priority.value} variant="outline-dark" value={priority.label}>
                            {priority.label}
                          </ToggleButton>
                        )
                      })}
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
  services: state.services.services,
  teams: state.teams.teams,
  priorities: state.priorities.priorities
});

const mapDispatchToProps = (dispatch) => ({
  updateQuerySettings: (params) => () => { }, // To be implemented as action
});

export default connect(mapStateToProps, mapDispatchToProps)(QuerySettingsComponent);