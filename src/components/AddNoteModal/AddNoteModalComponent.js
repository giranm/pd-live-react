import { useState } from 'react';
import { connect } from 'react-redux';

import { Modal, Form, Button } from 'react-bootstrap';

import { toggleDisplayAddNoteModal, addNote } from 'redux/incident_actions/actions';

import './AddNoteModalComponent.css';

const AddNoteModalComponent = ({
  incidentActions,
  incidentTableSettings,
  toggleDisplayAddNoteModal,
  addNote,
}) => {
  const { displayAddNoteModal } = incidentActions;
  const { selectedRows } = incidentTableSettings;

  const [note, setNote] = useState(null);

  return (
    <div className="add-note-modal-ctr">
      <Modal show={displayAddNoteModal} onHide={toggleDisplayAddNoteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              as="textarea"
              placeholder="Add note to incident(s) here"
              minLength={1}
              onChange={(e) => {
                setNote(e.target.value);
              }}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={toggleDisplayAddNoteModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => addNote(selectedRows, note)}>
            Add Note
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  incidentActions: state.incidentActions,
  incidentTableSettings: state.incidentTableSettings,
});

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayAddNoteModal: () => dispatch(toggleDisplayAddNoteModal()),
  addNote: (incidents, note) => dispatch(addNote(incidents, note)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNoteModalComponent);
