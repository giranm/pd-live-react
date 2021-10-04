import { connect } from 'react-redux';

import { Navbar, Nav } from 'react-bootstrap';

import { ReactComponent as SettingsCog } from 'assets/images/settings_cog.svg';
import logo from 'assets/images/pd_logo.png';

import './NavigationBarComponent.css';

import { toggleDisplayQuerySettings } from 'redux/query_settings/actions';

const NavigationBarComponent = ({ toggleDisplayQuerySettings }) => (
  <div className="navbar-ctr">
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>
        <img className="nav-bar-logo" src={logo} alt="logo" />
      </Navbar.Brand>
      <Navbar.Brand className="font-weight-bold">PagerDuty Live Incidents Console</Navbar.Brand>
      <Nav.Item className="ml-auto">
        <SettingsCog className="settings-toggle" onClick={() => toggleDisplayQuerySettings()} />
      </Nav.Item>
    </Navbar>
  </div>
);

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayQuerySettings: () => dispatch(toggleDisplayQuerySettings()),
});

export default connect(null, mapDispatchToProps)(NavigationBarComponent);
