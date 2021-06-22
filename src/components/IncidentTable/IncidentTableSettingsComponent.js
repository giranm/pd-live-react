import { connect } from "react-redux";

import {
  Modal,
  Button,
  Container,
  Row,
  Col,
} from 'react-bootstrap';

import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';

import "./IncidentTableSettingsComponent.css";

import {
  toggleIncidentTableSettings,
  updateTempIncidentTableColumns,
} from "redux/incident_table/actions";

const IncidentTableSettingsComponent = ({
  toggleIncidentTableSettings,
  incidentTableSettings,
  tempIncidentTableSettings,
  updateTempIncidentTableColumns
}) => {
  let { incidentTableColumns, displayIncidentTableSettings } = incidentTableSettings;
  let { incidentTableColumns: tempIncidentTableColumns } = tempIncidentTableSettings;

  // Generate options and selected items
  let availableColumns = incidentTableColumns.map(column => {
    return {
      label: column.name,
      value: column.name,
    }
  });

  let selectedColumns = tempIncidentTableColumns.map(column => {
    return {
      label: column.name,
      value: column.name,
    }
  });

  return (
    <div className="incident-table-settings-ctr">
      <Modal
        backdrop="static"
        size="lg"
        show={displayIncidentTableSettings}
        onHide={toggleIncidentTableSettings}
      >
        <Modal.Header closeButton>
          <Modal.Title as="h3">Incident Table Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <DualListBox
                  canFilter
                  preserveSelectOrder
                  showOrderButtons
                  showHeaderLabels
                  showNoOptionsText
                  simpleValue={false}
                  options={availableColumns}
                  selected={selectedColumns}
                  onChange={(cols) => updateTempIncidentTableColumns(cols)}
                />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleIncidentTableSettings}>
            Close
          </Button>
          <Button variant="primary" onClick={toggleIncidentTableSettings}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => ({
  incidentTableSettings: state.incidentTableSettings,
  tempIncidentTableSettings: state.tempIncidentTableSettings
});

const mapDispatchToProps = (dispatch) => ({
  toggleIncidentTableSettings: () => dispatch(toggleIncidentTableSettings()),
  updateTempIncidentTableColumns: (incidentTableColumns) => dispatch(updateTempIncidentTableColumns(incidentTableColumns))
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentTableSettingsComponent);