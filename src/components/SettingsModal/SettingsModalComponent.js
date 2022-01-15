import {
  useState,
} from 'react';
import {
  connect,
} from 'react-redux';

import {
  Modal, Button, Tabs, Tab,
} from 'react-bootstrap';

import DualListBox from 'react-dual-listbox';

import {
  saveIncidentTable as saveIncidentTableConnected,
} from 'redux/incident_table/actions';

import {
  toggleSettingsModal as toggleSettingsModalConnected,
  clearLocalCache as clearLocalCacheConnected,
} from 'redux/settings/actions';

import {
  availableIncidentTableColumns,
  getIncidentTableColumns,
} from 'config/incident-table-columns';

import 'react-dual-listbox/lib/react-dual-listbox.css';
import './SettingsModalComponent.scss';

const columnMapper = (column) => ({
  label: column.Header,
  value: column.Header,
});

const SettingsModalComponent = ({
  settings,
  incidentTable,
  toggleSettingsModal,
  saveIncidentTable,
  clearLocalCache,
}) => {
  const {
    displaySettingsModal,
  } = settings;
  const {
    incidentTableColumnsNames,
  } = incidentTable;

  // Create internal state for options
  const transformedIncidentTableColumns = getIncidentTableColumns(incidentTableColumnsNames);
  const [selectedColumns, setSelectedColumns] = useState(
    transformedIncidentTableColumns.map(columnMapper),
  );
  const availableColumns = availableIncidentTableColumns.map(columnMapper);

  return (
    <div className="settings-ctr">
      <Modal
        backdrop="static"
        dialogClassName="modal-90w"
        show={displaySettingsModal}
        onHide={toggleSettingsModal}
      >
        <Modal.Header closeButton>
          <Modal.Title as="h3">Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="incident-table-columns">
            <Tab eventKey="incident-table-columns" title="Incident Table Columns">
              <br />
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
              <br />
              <Button variant="primary" onClick={() => saveIncidentTable(selectedColumns)}>
                Update Columns
              </Button>
            </Tab>
            <Tab eventKey="local-cache" title="Local Cache">
              <br />
              <Button
                variant="warning"
                onClick={() => {
                  clearLocalCache();
                  toggleSettingsModal();
                  window.location.reload();
                }}
              >
                Clear Local Cache
              </Button>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  settings: state.settings,
  incidentTable: state.incidentTable,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSettingsModal: () => dispatch(toggleSettingsModalConnected()),
  saveIncidentTable: (updatedIncidentTableColumns) => {
    dispatch(saveIncidentTableConnected(updatedIncidentTableColumns));
  },
  clearLocalCache: () => dispatch(clearLocalCacheConnected()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModalComponent);
