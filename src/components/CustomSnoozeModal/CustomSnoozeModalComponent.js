import { useState } from "react";
import { connect } from "react-redux";
import moment from "moment";

import {
  Modal,
  Form,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import DatePicker from 'react-datepicker';

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

  // Internal state for snooze in hours
  const defaultSnoozeTimeHours = 1;
  const initialSnoozeTime = moment().add({ "hour": defaultSnoozeTimeHours })
  const [snoozeTime, setSnoozeTime] = useState(initialSnoozeTime.toDate());
  const snoozeDuration = moment(snoozeTime).diff(moment());
  const snoozeDurationFormatted = moment(snoozeDuration).format('H[ hour(s)]');

  // Internal state for snooze after tomorrow
  const tomorrow = moment()
    .add({ "days": 1 })
    .set({ "hour": 8, "minute": 0 });
  const [tomorrowSnoozeDate, setTomorrowSnoozeDate] = useState(tomorrow.toDate());
  const tomorrowDuration = moment(tomorrowSnoozeDate).diff(moment());
  const tomorrowDurationFormatted = moment(tomorrowDuration).format('H[ hour(s)] m[ minute(s)]');

  // Only unresolved incidents can be snoozed
  let { selectedRows } = incidentTableSettings;
  let unresolvedIncidents = filterIncidentsByField(selectedRows, "status", [TRIGGERED, ACKNOWLEDGED]);
  let modalTitle = unresolvedIncidents.length === 1
    ? `Snooze Incident #${unresolvedIncidents[0].incident_number}`
    : `Snooze ${unresolvedIncidents.length} incidents`;

  // Internal state to find active radio button
  const [activeButtonId, setActiveButton] = useState("snooze-hours")
  let duration = activeButtonId === "snooze-hours" ? parseInt(snoozeDuration / 1000) : parseInt(tomorrowDuration / 1000);
  let modalAction = `${modalTitle} for ${activeButtonId === "snooze-hours" ? snoozeDurationFormatted : tomorrowDurationFormatted}`

  return (
    <div className="custom-snooze-modal-ctr">
      <Modal
        show={displayCustomSnoozeModal}
        onHide={toggleDisplayCustomSnoozeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row xs={3}>
              <Col>
                <Form.Check
                  type="radio"
                  label="Snooze for the following hours"
                  name="snooze-group"
                  id="snooze-hours"
                  onChange={e => setActiveButton(e.target.id)}
                  defaultChecked
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  min={1}
                  max={24}
                  defaultValue={defaultSnoozeTimeHours}
                  onChange={e => setSnoozeTime(moment().add(e.target.value, "hours"))}
                />
              </Col>
            </Row>
            <br />
            <Row xs={3}>
              <Col>
                <Form.Check
                  type="radio"
                  label="Snooze until tomorrow at"
                  name="snooze-group"
                  id="snooze-tomorrow"
                  onChange={e => setActiveButton(e.target.id)}
                />
              </Col>
              <Col>
                <DatePicker
                  selected={tomorrowSnoozeDate}
                  onChange={date => setTomorrowSnoozeDate(date)}
                  minTime={moment().set({ "hours": 0, "minutes": 0 }).toDate()}
                  maxTime={moment().set({ "hours": 12, "minutes": 0 }).toDate()}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={60}
                  timeCaption="Time"
                  dateFormat="HH:mm aa"
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={toggleDisplayCustomSnoozeModal}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              snooze(selectedRows, duration);
              toggleDisplayCustomSnoozeModal();
            }}
          >
            {modalAction}
          </Button>
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