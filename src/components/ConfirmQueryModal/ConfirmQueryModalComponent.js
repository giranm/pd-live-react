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

import {
  MAX_INCIDENTS_LIMIT,
} from 'config/constants';

const ConfirmQueryModalComponent = ({
  querySettings,
  toggleDisplayConfirmQueryModal,
  confirmIncidentQuery,
}) => {
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
          {MAX_INCIDENTS_LIMIT}
          &nbsp;incidents will be retrieved.
          <br />
          <br />
          Continue?
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="retrieve-incidents-button"
            variant="primary"
            onClick={() => {
              confirmIncidentQuery(true);
              toggleDisplayConfirmQueryModal();
            }}
          >
            Retrieve Incidents
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  querySettings: state.querySettings,
});

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayConfirmQueryModal: () => dispatch(toggleDisplayConfirmQueryModalConnected()),
  confirmIncidentQuery: (confirm) => dispatch(confirmIncidentQueryConnected(confirm)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmQueryModalComponent);
