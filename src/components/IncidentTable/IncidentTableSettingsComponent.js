import { useEffect, useState } from "react";
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
} from "redux/incident_table/actions";

import { availableIncidentTableColumns } from "util/incident-table-columns";

const columnMapper = (column) => {
  return {
    label: column.name,
    value: column.name
  }
}

const IncidentTableSettingsComponent = ({
  incidentTableSettings,
  toggleIncidentTableSettings,
}) => {
  let { incidentTableColumns, displayIncidentTableSettings } = incidentTableSettings;

  // Create internal state for options
  const [selectedColumns, setSelectedColumns] = useState(incidentTableColumns.map(columnMapper));
  let availableColumns = availableIncidentTableColumns.map(columnMapper);

  useEffect(() => {
    console.log("Selected Columns", selectedColumns);
  }, [selectedColumns]);

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
                  onChange={(cols) => setSelectedColumns(cols)}
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
});

const mapDispatchToProps = (dispatch) => ({
  toggleIncidentTableSettings: () => dispatch(toggleIncidentTableSettings()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentTableSettingsComponent);