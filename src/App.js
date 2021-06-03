import { Navbar, Container } from 'react-bootstrap';

import IncidentTableComponent from "./components/IncidentTable/IncidentTableComponent";

import logo from "./assets/images/pd_logo.png";
import './App.css';

function App() {
  return (
    <div className="App">
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
      <Container fluid>
        <div className="incidents-table-ctr">
          <IncidentTableComponent />
        </div>
      </Container>
    </div>
  );
}

export default App;
