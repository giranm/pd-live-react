import {
  useState,
} from 'react';
import {
  connect,
} from 'react-redux';

import {
  Modal, Container, Row, Col, Tabs, Tab,
} from 'react-bootstrap';

import {
  useTranslation,
} from 'react-i18next';

import {
  toggleDisplayIncidentDetailsModal as toggleDisplayIncidentDetailsModalConnected,
} from 'redux/incident_details/actions';

import AlertsTableComponent from './subcomponents/AlertsTableComponent';
import IncidentTimelineComponent from './subcomponents/IncidentTimelineComponent';

import './IncidentDetailsModalComponent.scss';

const IncidentDetailsModalComponent = ({
  toggleDisplayIncidentDetailsModal, incidentDetails,
}) => {
  const {
    displayIncidentDetailsModal,
  } = incidentDetails;
  const {
    t,
  } = useTranslation();

  const [currentTab, setCurrentTab] = useState('alerts');

  return (
    <div className="incident-details-modal-ctr">
      <Modal
        backdrop="static"
        dialogClassName="modal-fullscreen"
        show={displayIncidentDetailsModal}
        onHide={toggleDisplayIncidentDetailsModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>[#99999] Incident Summary Here</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-fullscreen">
          <Container fluid>
            <Row>
              <Col>High Level Details Placeholder</Col>
            </Row>
            <Row>
              <Col>Incident Actions Placeholder</Col>
            </Row>
            <Row>
              <Col>Incident Fields Placeholder</Col>
              <Col>Notes Placeholder</Col>
            </Row>
            <Row>
              <Col>
                <Tabs activeKey={currentTab} onSelect={(k) => setCurrentTab(k)}>
                  <Tab eventKey="alerts" title={t('Alerts')}>
                    <AlertsTableComponent />
                  </Tab>
                  <Tab eventKey="timeline" title={t('Timeline')}>
                    <IncidentTimelineComponent />
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  incidentDetails: state.incidentDetails,
});

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayIncidentDetailsModal: () => dispatch(toggleDisplayIncidentDetailsModalConnected()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentDetailsModalComponent);
