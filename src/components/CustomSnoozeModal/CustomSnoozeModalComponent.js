import { useState } from "react";
import { connect } from "react-redux";
import moment from "moment";

import {
  Modal,
  Form,
  Button
} from 'react-bootstrap';

import DatePicker from "react-datepicker";

import {
  toggleDisplayCustomSnoozeModal,
  snooze
} from "redux/incident_actions/actions";

import {
  TRIGGERED,
  ACKNOWLEDGED,
  filterIncidentsByField
} from "util/incidents";

import "./CustomSnoozeModalComponent.css";

const CustomSnoozeModalComponent = ({
  toggleDisplayCustomSnoozeModal,
  snooze,
  incidentActions,
  incidentTableSettings,
}) => {
  let {
    displayCustomSnoozeModal,
  } = incidentActions;

  // Internal state for component; redux store not required
  const tomorrow = moment().add(1, "days");
  const [snoozeDate, setSnoozeDate] = useState(tomorrow.toDate());
  const duration = moment().diff(moment(snoozeDate), "hours");

  // Only unresolved incidents can be snoozed
  let { selectedRows } = incidentTableSettings;
  let unresolvedIncidents = filterIncidentsByField(selectedRows, "status", [TRIGGERED, ACKNOWLEDGED]);
  let modalTitle = unresolvedIncidents.length === 1
    ? `Snooze Incident #${unresolvedIncidents[0].incident_number}`
    : `Snooze ${unresolvedIncidents.length} incidents`;
  let modalAction = `${modalTitle} for ${duration}`

  return (
    <div className="custom-snooze-modal-ctr">
      <Modal
        // show={displayCustomSnoozeModal}
        // show
        onHide={toggleDisplayCustomSnoozeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePicker
            className="date-picker-snooze"
            showTimeSelect
            dateFormat="dd/MM/yyyy - HH:mm"
            todayButton={"Today"}
            selected={snoozeDate}
            minDate={tomorrow.toDate()}
            onChange={(date) => setSnoozeDate(date)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary">Cancel</Button>
          <Button variant="primary">{modalAction}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => ({
  incidentActions: state.incidentActions,
  incidentTableSettings: state.incidentTableSettings
});

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayCustomSnoozeModal: () => dispatch(toggleDisplayCustomSnoozeModal()),
  snooze: (incidents, duration) => dispatch(snooze(incidents, duration)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomSnoozeModalComponent);