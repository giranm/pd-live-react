import {
  useEffect, useState,
} from 'react';
import {
  connect,
} from 'react-redux';

import {
  Modal,
  Button,
  ButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
  Row,
  Col,
  Form,
} from 'react-bootstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import DualListBox from 'react-dual-listbox';

import {
  updateActionAlertsModal as updateActionAlertsModalConnected,
  toggleDisplayActionAlertsModal as toggleDisplayActionAlertsModalConnected,
} from 'redux/action_alerts/actions';
import {
  updateUserLocale as updateUserLocaleConnected,
} from 'redux/users/actions';
import {
  saveIncidentTable as saveIncidentTableConnected,
} from 'redux/incident_table/actions';
import {
  toggleSettingsModal as toggleSettingsModalConnected,
  setDefaultSinceDateTenor as setDefaultSinceDateTenorConnected,
  setAlertCustomDetailColumns as setAlertCustomDetailColumnsConnected,
  clearLocalCache as clearLocalCacheConnected,
} from 'redux/settings/actions';

import locales from 'config/locales';

import {
  availableIncidentTableColumns,
  getReactTableColumnSchemas,
} from 'config/incident-table-columns';

import {
  defaultSinceDateTenors,
} from 'util/settings';

import {
  reactSelectStyle,
} from 'util/styles';

import 'react-dual-listbox/lib/react-dual-listbox.css';
import './SettingsModalComponent.scss';

const columnMapper = (column) => ({
  label: column.Header,
  value: column.Header,
  Header: column.Header,
  columnType: 'incident',
});

const SettingsModalComponent = ({
  settings,
  incidentTable,
  toggleSettingsModal,
  users,
  updateUserLocale,
  setDefaultSinceDateTenor,
  setAlertCustomDetailColumns,
  saveIncidentTable,
  clearLocalCache,
  updateActionAlertsModal,
  toggleDisplayActionAlertsModal,
}) => {
  const {
    displaySettingsModal, defaultSinceDateTenor, alertCustomDetailFields,
  } = settings;
  const {
    incidentTableColumns,
  } = incidentTable;
  const {
    currentUserLocale,
  } = users;

  // Create internal state for options
  const selectLocales = Object.keys(locales).map((locale) => ({
    label: locales[locale],
    value: locale,
  }));
  const [selectedLocale, setSelectedLocale] = useState({
    label: locales[currentUserLocale],
    value: currentUserLocale,
  });

  const [tempSinceDateTenor, setTempSinceDateTenor] = useState(defaultSinceDateTenor);

  const transformedIncidentTableColumns = getReactTableColumnSchemas(incidentTableColumns);
  const [selectedColumns, setSelectedColumns] = useState(
    transformedIncidentTableColumns.map(columnMapper),
  );

  const [availableColumns, setAvailableColumns] = useState(
    availableIncidentTableColumns.map(columnMapper),
  );

  useEffect(() => {
    const tempAvailableIncidentTableColumns = availableIncidentTableColumns.map(columnMapper);
    alertCustomDetailFields.forEach((field) => {
      const tempField = { ...field };
      tempField.columnType = 'alert';
      tempAvailableIncidentTableColumns.push(tempField);
    });
    setAvailableColumns(tempAvailableIncidentTableColumns);
  }, [alertCustomDetailFields]);

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
          <Tabs defaultActiveKey="user-profile">
            <Tab eventKey="user-profile" title="User Profile">
              <br />
              <Form>
                <Form.Group as={Row}>
                  <Form.Label id="user-profile-locale-label" column sm={2}>
                    Locale
                  </Form.Label>
                  <Col xs={6}>
                    <Select
                      id="user-locale-select"
                      styles={reactSelectStyle}
                      options={selectLocales}
                      value={selectedLocale}
                      onChange={(locale) => setSelectedLocale(locale)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label id="user-profile-default-since-date-tenor-label" column sm={2}>
                    Default Since Date Lookback
                  </Form.Label>
                  <Col xs={6}>
                    <ButtonGroup toggle>
                      {defaultSinceDateTenors.map((tenor) => (
                        <ToggleButton
                          key={`${tenor}`}
                          id={`default-since-date-${tenor}-button`}
                          type="radio"
                          variant="outline-secondary"
                          name="radio"
                          value={tenor}
                          checked={tempSinceDateTenor === tenor}
                          onChange={(e) => setTempSinceDateTenor(e.currentTarget.value)}
                        >
                          {tenor}
                        </ToggleButton>
                      ))}
                    </ButtonGroup>
                  </Col>
                </Form.Group>
              </Form>
              <br />
              <Button
                id="update-user-profile-button"
                variant="primary"
                onClick={() => {
                  updateUserLocale(selectedLocale.value);
                  setDefaultSinceDateTenor(tempSinceDateTenor);
                  updateActionAlertsModal('success', 'Updated user profile settings');
                  toggleDisplayActionAlertsModal();
                }}
              >
                Update User Profile
              </Button>
            </Tab>
            <Tab eventKey="incident-table-columns" title="Incident Table Columns">
              <br />
              <Col>
                <h4>Column Selector</h4>
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
              <br />
              <Col>
                <h4>Alert Custom Detail Column Definitions</h4>
                <CreatableSelect
                  isMulti
                  isClearable
                  placeholder="Enter 'Column Header:JSON Path' (e.g. Environment:details.env)"
                  defaultValue={alertCustomDetailFields}
                  onChange={(fields) => setAlertCustomDetailColumns(fields)}
                />
              </Col>
              <br />
              <Button
                id="update-incident-table-columns-button"
                variant="primary"
                onClick={() => {
                  saveIncidentTable(selectedColumns);
                  updateActionAlertsModal('success', 'Updated incident table columns');
                  toggleDisplayActionAlertsModal();
                }}
              >
                Update Columns
              </Button>
            </Tab>
            <Tab eventKey="local-cache" title="Local Cache">
              <br />
              <Button
                id="clear-local-cache-button"
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
  users: state.users,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSettingsModal: () => dispatch(toggleSettingsModalConnected()),
  updateUserLocale: (locale) => dispatch(updateUserLocaleConnected(locale)),
  setDefaultSinceDateTenor: (defaultSinceDateTenor) => {
    dispatch(setDefaultSinceDateTenorConnected(defaultSinceDateTenor));
  },
  setAlertCustomDetailColumns: (alertCustomDetailFields) => {
    dispatch(setAlertCustomDetailColumnsConnected(alertCustomDetailFields));
  },
  saveIncidentTable: (updatedIncidentTableColumns) => {
    dispatch(saveIncidentTableConnected(updatedIncidentTableColumns));
  },
  clearLocalCache: () => dispatch(clearLocalCacheConnected()),
  updateActionAlertsModal: (actionAlertsModalType, actionAlertsModalMessage) => {
    dispatch(updateActionAlertsModalConnected(actionAlertsModalType, actionAlertsModalMessage));
  },
  toggleDisplayActionAlertsModal: () => dispatch(toggleDisplayActionAlertsModalConnected()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModalComponent);
