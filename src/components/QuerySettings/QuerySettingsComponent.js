import {
  connect,
} from 'react-redux';

import {
  Row,
  Col,
  ToggleButton,
  ToggleButtonGroup,
  Form,
  Accordion,
  Container,
} from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import DatePicker from 'react-datepicker';

import {
  FontAwesomeIcon,
} from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faShieldAlt,
  faCheckCircle,
  faChevronUp,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

import './QuerySettingsComponent.scss';

import {
  updateQuerySettingsSinceDate as updateQuerySettingsSinceDateConnected,
  updateQuerySettingsIncidentStatus as updateQuerySettingsIncidentStatusConnected,
  updateQuerySettingsIncidentUrgency as updateQuerySettingsIncidentUrgencyConnected,
  updateQuerySettingsIncidentPriority as updateQuerySettingsIncidentPriorityConnected,
  updateQuerySettingsTeams as updateQuerySettingsTeamsConnected,
  updateQuerySettingsServices as updateQuerySettingsServicesConnected,
} from 'redux/query_settings/actions';

import {
  TRIGGERED, ACKNOWLEDGED, RESOLVED, HIGH, LOW,
} from 'util/incidents';

import {
  getObjectsFromList,
} from 'util/helpers';

const animatedComponents = makeAnimated();

const customStyles = {
  // Ensure that dropdowns appear over table header
  menu: (provided) => ({
    ...provided,
    zIndex: 2,
  }),
};

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
    displayQuerySettings,
    sinceDate,
    incidentStatus,
    incidentUrgency,
    incidentPriority,
    teamIds,
    serviceIds,
  } = querySettings;
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
    color: priority.color,
  }));

  // Get "stored" option values
  const storedSelectTeams = getObjectsFromList(selectListTeams, teamIds, 'value');
  const storedSelectServices = getObjectsFromList(selectListServices, serviceIds, 'value');

  return (
    <div className="query-settings-ctr" id="query-settings-ctr">
      <Accordion defaultActiveKey="0">
        <Accordion.Collapse eventKey={eventKey}>
          <Container className="card bg-light query-settings-inner-ctr" fluid>
            <Row>
              <Col xs="auto">
                Since:
                {' '}
                <br />
                <DatePicker
                  className="date-picker"
                  dateFormat="dd/MM/yyyy"
                  todayButton="Today"
                  selected={sinceDate}
                  onChange={(date) => updateQuerySettingsSinceDate(date)}
                />
              </Col>
              <Col xs="auto">
                State:
                {' '}
                <Form.Group>
                  <ToggleButtonGroup
                    type="checkbox"
                    value={incidentStatus}
                    onChange={(val) => updateQuerySettingsIncidentStatus(val)}
                  >
                    <ToggleButton variant="outline-danger" value={TRIGGERED}>
                      <div className="action-icon">
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                      </div>
                      Triggered
                    </ToggleButton>
                    <ToggleButton variant="outline-warning" value={ACKNOWLEDGED}>
                      <div className="action-icon">
                        <FontAwesomeIcon icon={faShieldAlt} />
                      </div>
                      Acknowleged
                    </ToggleButton>
                    <ToggleButton variant="outline-success" value={RESOLVED}>
                      <div className="action-icon">
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </div>
                      Resolved
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Form.Group>
              </Col>
              <Col xs="auto">
                Urgency:
                {' '}
                <Form.Group>
                  <ToggleButtonGroup
                    type="checkbox"
                    value={incidentUrgency}
                    onChange={(val) => updateQuerySettingsIncidentUrgency(val)}
                  >
                    <ToggleButton
                      id="query-urgency-high-button"
                      variant="outline-secondary"
                      value={HIGH}
                    >
                      <div className="action-icon">
                        <FontAwesomeIcon icon={faChevronUp} />
                      </div>
                      High
                    </ToggleButton>
                    <ToggleButton
                      id="query-urgency-low-button"
                      variant="outline-secondary"
                      value={LOW}
                    >
                      <div className="action-icon">
                        <FontAwesomeIcon icon={faChevronDown} />
                      </div>
                      Low
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Form.Group>
              </Col>
              <Col xs="auto">
                Priorities:
                {' '}
                <Form.Group>
                  <ToggleButtonGroup
                    type="checkbox"
                    value={incidentPriority}
                    onChange={(val) => updateQuerySettingsIncidentPriority(val)}
                  >
                    {selectListPriorities.map((priority) => (
                      <ToggleButton
                        key={priority.value}
                        variant="outline-secondary"
                        value={priority.value}
                        style={{
                          color: `#${priority.color}`,
                          fontWeight: 1000,
                        }}
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
                Team:
                {' '}
                <Form.Group>
                  <Select
                    styles={customStyles}
                    onChange={(selectedTeams) => {
                      const teamIdsInt = selectedTeams.map((team) => team.value);
                      updateQuerySettingsTeams(teamIdsInt);
                    }}
                    components={animatedComponents}
                    isMulti
                    options={selectListTeams}
                    value={storedSelectTeams}
                  />
                </Form.Group>
              </Col>
              <Col>
                Service:
                {' '}
                <Form.Group>
                  <Select
                    styles={customStyles}
                    onChange={(selectedServices) => {
                      const serviceIdsInt = selectedServices.map((service) => service.value);
                      updateQuerySettingsServices(serviceIdsInt);
                    }}
                    components={animatedComponents}
                    isMulti
                    options={selectListServices}
                    value={storedSelectServices}
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
  updateQuerySettingsSinceDate: (sinceDate) => {
    dispatch(updateQuerySettingsSinceDateConnected(sinceDate));
  },
  updateQuerySettingsIncidentStatus: (incidentStatus) => {
    dispatch(updateQuerySettingsIncidentStatusConnected(incidentStatus));
  },
  updateQuerySettingsIncidentUrgency: (incidentUrgency) => {
    dispatch(updateQuerySettingsIncidentUrgencyConnected(incidentUrgency));
  },
  updateQuerySettingsIncidentPriority: (incidentPriority) => {
    dispatch(updateQuerySettingsIncidentPriorityConnected(incidentPriority));
  },
  updateQuerySettingsTeams: (teamIds) => dispatch(updateQuerySettingsTeamsConnected(teamIds)),
  updateQuerySettingsServices: (serviceIds) => {
    dispatch(updateQuerySettingsServicesConnected(serviceIds));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuerySettingsComponent);
