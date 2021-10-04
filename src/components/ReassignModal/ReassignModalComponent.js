import { useState } from 'react';
import { connect } from 'react-redux';

import { Modal, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { toggleDisplayReassignModal, reassign } from 'redux/incident_actions/actions';

import './ReassignModalComponent.css';

const animatedComponents = makeAnimated();

const ReassignModalComponent = ({
  incidentActions,
  incidentTableSettings,
  escalationPolicies,
  users,
  toggleDisplayReassignModal,
  reassign,
}) => {
  const { displayReassignModal } = incidentActions;
  const { selectedRows } = incidentTableSettings;

  const [assignment, setAssignment] = useState(null);

  // Generate lists/data from store
  const selectListAssignments = escalationPolicies
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
    <div className="resassign-modal-ctr">
      <Modal
        show={displayReassignModal}
        onHide={() => {
          setAssignment(null);
          toggleDisplayReassignModal();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reassign To</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Select
              onChange={(selectedAssignment) => {
                setAssignment(selectedAssignment);
              }}
              components={animatedComponents}
              options={selectListAssignments}
              placeholder="Search for Escalation Policy or User"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setAssignment(null);
              toggleDisplayReassignModal();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={assignment === null}
            onClick={() => {
              setAssignment(null);
              reassign(selectedRows, assignment);
            }}
          >
            Reassign
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  incidentActions: state.incidentActions,
  incidentTableSettings: state.incidentTableSettings,
  escalationPolicies: state.escalationPolicies.escalationPolicies,
  users: state.users.users,
});

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayReassignModal: () => dispatch(toggleDisplayReassignModal()),
  reassign: (incidents, assignment) => dispatch(reassign(incidents, assignment)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReassignModalComponent);
