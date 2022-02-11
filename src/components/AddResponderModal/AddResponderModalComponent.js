import {
  useState,
} from 'react';
import {
  connect,
} from 'react-redux';

import {
  Modal, Form, Button,
} from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import {
  toggleDisplayAddResponderModal as toggleDisplayAddResponderModalConnected,
  addResponder as addResponderConnected,
} from 'redux/incident_actions/actions';

import './AddResponderModalComponent.scss';

const animatedComponents = makeAnimated();

const AddResponderModalComponent = ({
  incidentActions,
  incidentTable,
  escalationPolicies,
  users,
  toggleDisplayAddResponderModal,
  addResponder,
}) => {
  const {
    displayAddResponderModal,
  } = incidentActions;
  const {
    selectedRows,
  } = incidentTable;

  const messageMaxChars = 110;

  const [responderRequestTargets, setResponderRequestTargets] = useState([]);
  const [message, setMessage] = useState('');

  // Generate lists/data from store
  const selectListResponderRequestTargets = escalationPolicies
    .map((escalationPolicy) => ({
      label: `EP: ${escalationPolicy.name}`,
      name: escalationPolicy.name,
      value: escalationPolicy.id,
      type: 'escalation_policy',
    }))
    .concat(
      users.map((user) => ({
        label: `User: ${user.name}`,
        name: user.name,
        value: user.id,
        type: 'user',
      })),
    );

  return (
    <div className="add-responder-modal-ctr">
      <Modal
        show={displayAddResponderModal}
        onHide={() => {
          setResponderRequestTargets([]);
          toggleDisplayAddResponderModal();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Responders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Responders</Form.Label>
              <Select
                id="add-responders-select"
                onChange={(selectedTargets) => {
                  setResponderRequestTargets(selectedTargets);
                }}
                components={animatedComponents}
                options={selectListResponderRequestTargets}
                placeholder="Search for Escalation Policies and/or Users"
                isMulti
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                id="add-responders-textarea"
                as="textarea"
                placeholder="Provide brief message for additional responders"
                minLength={1}
                maxLength={messageMaxChars}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <div className="add-responder-message-remaining-chars">
                {`${messageMaxChars - message.length} characters remaining`}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="add-responders-button"
            variant="primary"
            disabled={responderRequestTargets.length === 0}
            onClick={() => {
              setResponderRequestTargets([]);
              addResponder(selectedRows, responderRequestTargets, message);
            }}
          >
            Add Responder(s)
          </Button>
          <Button
            variant="light"
            onClick={() => {
              setResponderRequestTargets([]);
              toggleDisplayAddResponderModal();
            }}
          >
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
  escalationPolicies: state.escalationPolicies.escalationPolicies,
  users: state.users.users,
});

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayAddResponderModal: () => dispatch(toggleDisplayAddResponderModalConnected()),
  addResponder: (incidents, responderRequestTargets, message) => {
    dispatch(addResponderConnected(incidents, responderRequestTargets, message));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddResponderModalComponent);
