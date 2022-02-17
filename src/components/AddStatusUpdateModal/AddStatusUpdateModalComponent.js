import {
  useState, useEffect,
} from 'react';
import {
  connect,
} from 'react-redux';

import {
  Modal, Form, Button,
} from 'react-bootstrap';

import {
  toggleDisplayAddStatusUpdateModal as toggleDisplayAddStatusUpdateModalConnected,
  addStatusUpdate as addStatusUpdateConnected,
} from 'redux/incident_actions/actions';

import './AddStatusUpdateModalComponent.scss';

const AddStatusUpdateModalComponent = ({
  incidentActions,
  incidentTable,
  toggleDisplayAddStatusUpdateModal,
  addStatusUpdate,
}) => {
  const {
    displayAddStatusUpdateModal,
  } = incidentActions;
  const {
    selectedRows,
  } = incidentTable;

  const [statusUpdate, setStatusUpdate] = useState('');
  useEffect(() => {
    setStatusUpdate('');
  }, [displayAddStatusUpdateModal]);

  return (
    <div className="add-status-update-modal-ctr">
      <Modal show={displayAddStatusUpdateModal} onHide={toggleDisplayAddStatusUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Status Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              id="add-status-update-textarea"
              as="textarea"
              placeholder="Add status update to incident(s) here"
              minLength={1}
              onChange={(e) => {
                setStatusUpdate(e.target.value);
              }}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="add-status-update-button"
            variant="primary"
            onClick={() => addStatusUpdate(selectedRows, statusUpdate)}
            disabled={statusUpdate === ''}
          >
            Send Update
          </Button>
          <Button variant="light" onClick={toggleDisplayAddStatusUpdateModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  incidentActions: state.incidentActions,
  incidentTable: state.incidentTable,
});

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayAddStatusUpdateModal: () => dispatch(toggleDisplayAddStatusUpdateModalConnected()),
  addStatusUpdate: (incidents, statusUpdate) => {
    dispatch(addStatusUpdateConnected(incidents, statusUpdate));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddStatusUpdateModalComponent);
