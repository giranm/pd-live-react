import { useState } from 'react';
import { connect } from 'react-redux';

import { Modal, Form, Button } from 'react-bootstrap';

import { toggleDisplayMergeModal, merge } from 'redux/incident_actions/actions';

import './MergeModalComponent.scss';

const MergeModalComponent = ({
  incidentActions,
  incidentTableSettings,
  toggleDisplayMergeModal,
  merge,
}) => {
  const { displayMergeModal } = incidentActions;
  const { selectedRows } = incidentTableSettings;

  const [note, setNote] = useState(null);

  return (
    <div className="merge-modal-ctr">
      <Modal show={displayMergeModal} onHide={toggleDisplayMergeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Merge Incidents</Modal.Title>
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
          <Button
            variant="primary"
            onClick={() => merge(selectedRows, note)}
            disabled={note === null}
          >
            Merge Incidents
          </Button>
          <Button variant="light" onClick={toggleDisplayMergeModal}>
            Cancel
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
  toggleDisplayMergeModal: () => dispatch(toggleDisplayMergeModal()),
  merge: (incidents, note) => dispatch(merge(incidents, note)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MergeModalComponent);
