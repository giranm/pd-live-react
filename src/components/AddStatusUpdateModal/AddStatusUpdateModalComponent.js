import {
  useState, useEffect,
} from 'react';
import {
  connect,
} from 'react-redux';

import {
  Modal, Button,
} from 'react-bootstrap';

import ReactQuill from 'react-quill';

import {
  toggleDisplayAddStatusUpdateModal as toggleDisplayAddStatusUpdateModalConnected,
  addStatusUpdate as addStatusUpdateConnected,
} from 'redux/incident_actions/actions';

import 'react-quill/dist/quill.snow.css';
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

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  const [statusUpdate, setStatusUpdate] = useState('');
  useEffect(() => {
    setStatusUpdate('');
  }, [displayAddStatusUpdateModal]);

  return (
    <div className="add-status-update-modal-ctr">
      <Modal
        show={displayAddStatusUpdateModal}
        onHide={toggleDisplayAddStatusUpdateModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Status Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            value={statusUpdate}
            onChange={setStatusUpdate}
          />
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
