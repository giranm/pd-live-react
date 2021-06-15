import { Navbar } from "react-bootstrap"

import "./NavigationBarComponent.css";
import logo from "assets/images/pd_logo.png";

const NavigationBarComponent = () => {
  return (
    <div className="navbar-ctr">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
          <img className="nav-bar-logo" src={logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Brand className="font-weight-bold">
          PagerDuty Live Incidents Console
      </Navbar.Brand>
      </Navbar>
    </div>
  )
}

export default NavigationBarComponent;