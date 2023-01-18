import {
  connect,
} from 'react-redux';

import {
  Modal,
} from 'react-bootstrap';

import {
  toggleDisplayIncidentDetailsModal as toggleDisplayIncidentDetailsModalConnected,
} from 'redux/incident_details/actions';

import './IncidentDetailsModalComponent.scss';

const IncidentDetailsModalComponent = ({
  toggleDisplayIncidentDetailsModal, incidentDetails,
}) => {
  const {
    displayIncidentDetailsModal,
  } = incidentDetails;

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
        <Modal.Body className="modal-body-fullscreen">Incident Details Here</Modal.Body>
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
