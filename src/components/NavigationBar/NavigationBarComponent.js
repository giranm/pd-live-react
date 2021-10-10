import { connect } from 'react-redux';
import {
  Navbar, Nav, NavDropdown, Button,
} from 'react-bootstrap';

import PDOAuth from 'util/pdoauth';

import './NavigationBarComponent.scss';

import GlobalSearchComponent from 'components/GlobalSearch/GlobalSearchComponent';

import { toggleIncidentTableSettings } from 'redux/incident_table/actions';
import { toggleDisplayQuerySettings } from 'redux/query_settings/actions';

const NavigationBarComponent = ({
  displayQuerySettings,
  toggleIncidentTableSettings,
  toggleDisplayQuerySettings,
}) => (
  <div className="navbar-ctr">
    <Navbar bg="light" variant="light">
      <Navbar.Brand className="nav-bar-logo-ctr">
        <div className="nav-bar-logo-black" href="/" alt="PagerDuty home page">
          PagerDuty
        </div>
      </Navbar.Brand>
      <Navbar.Brand className="font-weight-bold">
        Live Incidents Console
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Nav>
          <Nav.Item className="ml-auto">
            <Button
              size="sm"
              className="filters-toggle"
              variant={displayQuerySettings ? 'success' : 'outline-success'}
              onClick={() => toggleDisplayQuerySettings()}
            >
              {`Filters ${displayQuerySettings ? '▼' : '▲'}`}
            </Button>
          </Nav.Item>
          <Nav.Item className="ml-auto">
            <GlobalSearchComponent />
          </Nav.Item>
          <Nav.Item className="ml-auto">
            <NavDropdown
              className="settings-panel-dropdown"
              title={
                <div className="settings-panel-icon" />
            }
              alignRight
            >
              <NavDropdown.Item
                className="ml-auto"
                onClick={() => toggleIncidentTableSettings()}
              >
                Settings
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => PDOAuth.logout()}
              >
                Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);
const mapStateToProps = (state) => ({
  displayQuerySettings: state.querySettings.displayQuerySettings,
});

const mapDispatchToProps = (dispatch) => ({
  toggleIncidentTableSettings: () => dispatch(toggleIncidentTableSettings()),
  toggleDisplayQuerySettings: () => dispatch(toggleDisplayQuerySettings()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBarComponent);
