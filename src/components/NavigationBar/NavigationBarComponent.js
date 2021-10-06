import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';

import { ReactComponent as SettingsCog } from 'assets/images/settings_cog.svg';

import './NavigationBarComponent.css';

import GlobalSearchComponent from 'components/GlobalSearch/GlobalSearchComponent';

import { toggleDisplayQuerySettings } from 'redux/query_settings/actions';

const NavigationBarComponent = ({ toggleDisplayQuerySettings }) => (
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
            <GlobalSearchComponent />
          </Nav.Item>
          <Nav.Item className="ml-auto">
            <SettingsCog className="settings-toggle" onClick={() => toggleDisplayQuerySettings()} />
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayQuerySettings: () => dispatch(toggleDisplayQuerySettings()),
});

export default connect(null, mapDispatchToProps)(NavigationBarComponent);
