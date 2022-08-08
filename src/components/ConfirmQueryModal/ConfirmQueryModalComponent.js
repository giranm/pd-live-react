import {
  connect,
} from 'react-redux';

import {
  Modal, Button,
} from 'react-bootstrap';

import {
  toggleDisplayConfirmQueryModal as toggleDisplayConfirmQueryModalConnected,
  confirmIncidentQuery as confirmIncidentQueryConnected,
} from 'redux/query_settings/actions';

const ConfirmQueryModalComponent = ({
  settings,
  querySettings,
  toggleDisplayConfirmQueryModal,
  confirmIncidentQuery,
}) => {
  const {
    maxIncidentsLimit,
  } = settings;
  const {
    displayConfirmQueryModal, totalIncidentsFromQuery,
  } = querySettings;

  const handleCancel = () => {
    confirmIncidentQuery(false);
    toggleDisplayConfirmQueryModal();
  };

  return (
    <div className="confirm-query-modal-ctr">
      <Modal show={displayConfirmQueryModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Max Incidents Limit Reached</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Current query parameters match&nbsp;
          {totalIncidentsFromQuery}
          &nbsp;incidents.
          <br />
          Only the first&nbsp;
          {maxIncidentsLimit}
          &nbsp;incidents will be retrieved.
          <br />
          <br />
          Continue?
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="retrieve-incident-query-button"
            variant="primary"
            onClick={() => {
              confirmIncidentQuery(true);
              toggleDisplayConfirmQueryModal();
            }}
          >
            Retrieve Incidents
          </Button>
          <Button id="cancel-incident-query-button" variant="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  settings: state.settings,
  querySettings: state.querySettings,
});

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayConfirmQueryModal: () => dispatch(toggleDisplayConfirmQueryModalConnected()),
  confirmIncidentQuery: (confirm) => dispatch(confirmIncidentQueryConnected(confirm)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmQueryModalComponent);
