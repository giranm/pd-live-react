import { useState } from "react";
import { connect } from "react-redux";

import {
  Modal,
  Form,
  Button
} from 'react-bootstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

import {
  toggleDisplayAddResponderModal,
  addResponder
} from "redux/incident_actions/actions";

import "./AddResponderModalComponent.css";

const animatedComponents = makeAnimated();

const AddResponderModalComponent = ({
  incidentActions,
  incidentTableSettings,
  escalationPolicies,
  users,
  toggleDisplayAddResponderModal,
  addResponder,
}) => {
  let { displayAddResponderModal } = incidentActions;
  let { selectedRows } = incidentTableSettings;

  let messageMaxChars = 110;

  const [responderRequestTargets, setResponderRequestTargets] = useState([]);
  const [message, setMessage] = useState("");

  // Generate lists/data from store
  let selectListResponderRequestTargets = escalationPolicies.map(escalationPolicy => {
    return {
      label: `EP: ${escalationPolicy.name}`,
      name: escalationPolicy.name,
      value: escalationPolicy.id,
      type: "escalation_policy"
    }
  }).concat(
    users.map(user => {
      return {
        label: `User: ${user.name}`,
        name: user.name,
        value: user.id,
        type: "user"
      }
    })
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
                onChange={(selectedTargets) => {
                  setResponderRequestTargets(selectedTargets)
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
                as="textarea"
                placeholder="Provide brief message for additional responders"
                minLength={1}
                maxLength={messageMaxChars}
                onChange={(e) => { setMessage(e.target.value) }}
              />
              <div className="add-responder-message-remaining-chars">
                {`${messageMaxChars - message.length} characters remaining`}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setResponderRequestTargets([]);
              toggleDisplayAddResponderModal();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={responderRequestTargets.length === 0 ? true : false}
            onClick={() => {
              setResponderRequestTargets([]);
              addResponder(selectedRows, responderRequestTargets, message);
            }}
          >
            Add Responder(s)
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => ({
  incidentActions: state.incidentActions,
  incidentTableSettings: state.incidentTableSettings,
  escalationPolicies: state.escalationPolicies.escalationPolicies,
  users: state.users.users,
});

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayAddResponderModal: () => dispatch(toggleDisplayAddResponderModal()),
  addResponder: (incidents, responderRequestTargets, message) => dispatch(addResponder(incidents, responderRequestTargets, message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddResponderModalComponent);