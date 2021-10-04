import { connect } from 'react-redux';

import {
  Row,
  Col,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Form,
  Accordion,
  Container,
} from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import DatePicker from 'react-datepicker';

import './QuerySettingsComponent.css';

import {
  updateQuerySettingsSinceDate,
  updateQuerySettingsIncidentStatus,
  updateQuerySettingsIncidentUrgency,
  updateQuerySettingsIncidentPriority,
  updateQuerySettingsTeams,
  updateQuerySettingsServices,
} from 'redux/query_settings/actions';

import {
  TRIGGERED, ACKNOWLEDGED, RESOLVED, HIGH, LOW,
} from 'util/incidents';

const animatedComponents = makeAnimated();

const QuerySettingsComponent = ({
  querySettings,
  services,
  teams,
  priorities,
  updateQuerySettingsSinceDate,
  updateQuerySettingsIncidentStatus,
  updateQuerySettingsIncidentUrgency,
  updateQuerySettingsIncidentPriority,
  updateQuerySettingsTeams,
  updateQuerySettingsServices,
}) => {
  const {
    displayQuerySettings, sinceDate, incidentStatus, incidentUrgency, incidentPriority,
  } =
    querySettings;
  const eventKey = displayQuerySettings ? '0' : '1';

  // Generate lists/data from store
  const selectListServices = services.map((service) => ({
    label: service.name,
    value: service.id,
  }));

  const selectListTeams = teams.map((team) => ({
    label: team.name,
    value: team.id,
  }));

  const selectListPriorities = priorities.map((priority) => ({
    label: priority.name,
    value: priority.id,
  }));

  return (
    <div className="query-settings-ctr">
      <br />
      <Accordion defaultActiveKey="0">
        <Accordion.Collapse eventKey={eventKey}>
          <Container className="card bg-light query-settings-inner-ctr" fluid>
            <Row>
              <Col xs="auto">
                Since: <br />
                <DatePicker
                  className="date-picker"
                  dateFormat="dd/MM/yyyy"
                  todayButton="Today"
                  selected={sinceDate}
                  onChange={(date) => updateQuerySettingsSinceDate(date)}
                />
              </Col>
              <Col xs="auto">
                State:{' '}
                <Form.Group>
                  <ToggleButtonGroup
                    type="checkbox"
                    value={incidentStatus}
                    onChange={(val) => updateQuerySettingsIncidentStatus(val)}
                  >
                    <ToggleButton variant="outline-dark" value={TRIGGERED}>
                      Triggered
                    </ToggleButton>
                    <ToggleButton variant="outline-dark" value={ACKNOWLEDGED}>
                      Acknowleged
                    </ToggleButton>
                    <ToggleButton variant="outline-dark" value={RESOLVED}>
                      Resolved
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Form.Group>
              </Col>
              <Col xs="auto">
                Urgency:{' '}
                <Form.Group>
                  <ToggleButtonGroup
                    type="checkbox"
                    value={incidentUrgency}
                    onChange={(val) => updateQuerySettingsIncidentUrgency(val)}
                  >
                    <ToggleButton variant="outline-dark" value={HIGH}>
                      High
                    </ToggleButton>
                    <ToggleButton variant="outline-dark" value={LOW}>
                      Low
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Form.Group>
              </Col>
              <Col xs="auto">
                Priorities:{' '}
                <Form.Group>
                  <ToggleButtonGroup
                    type="checkbox"
                    value={incidentPriority}
                    onChange={(val) => updateQuerySettingsIncidentPriority(val)}
                  >
                    {selectListPriorities.map((priority) => (
                      <ToggleButton
                        key={priority.value}
                        variant="outline-dark"
                        value={priority.value}
                      >
                        {priority.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                Team:{' '}
                <Form.Group>
                  <Select
                    onChange={(selectedTeams) => {
                      const teamIds = selectedTeams.map((team) => team.value);
                      updateQuerySettingsTeams(teamIds);
                    }}
                    components={animatedComponents}
                    isMulti
                    options={selectListTeams}
                  />
                </Form.Group>
              </Col>
              <Col>
                Service:{' '}
                <Form.Group>
                  <Select
                    onChange={(selectedServices) => {
                      const serviceIds = selectedServices.map((service) => service.value);
                      updateQuerySettingsServices(serviceIds);
                    }}
                    components={animatedComponents}
                    isMulti
                    options={selectListServices}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Accordion.Collapse>
      </Accordion>
    </div>
  );
};

const mapStateToProps = (state) => ({
  querySettings: state.querySettings,
  services: state.services.services,
  teams: state.teams.teams,
  priorities: state.priorities.priorities,
});

const mapDispatchToProps = (dispatch) => ({
  updateQuerySettingsSinceDate: (sinceDate) => dispatch(updateQuerySettingsSinceDate(sinceDate)),
  updateQuerySettingsIncidentStatus: (incidentStatus) => dispatch(updateQuerySettingsIncidentStatus(incidentStatus)),
  updateQuerySettingsIncidentUrgency: (incidentUrgency) => dispatch(updateQuerySettingsIncidentUrgency(incidentUrgency)),
  updateQuerySettingsIncidentPriority: (incidentPriority) => dispatch(updateQuerySettingsIncidentPriority(incidentPriority)),
  updateQuerySettingsTeams: (teamIds) => dispatch(updateQuerySettingsTeams(teamIds)),
  updateQuerySettingsServices: (serviceIds) => dispatch(updateQuerySettingsServices(serviceIds)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuerySettingsComponent);
