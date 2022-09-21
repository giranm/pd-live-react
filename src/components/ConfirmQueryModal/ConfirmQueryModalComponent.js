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
  useTranslation,
} from 'react-i18next';

const ConfirmQueryModalComponent = ({
  settings,
  querySettings,
  toggleDisplayConfirmQueryModal,
  confirmIncidentQuery,
}) => {
  const {
    t,
  } = useTranslation();
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
          <Modal.Title>{t('Max Incidents Limit Reached')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('Current query parameters match X incidents', { totalIncidentsFromQuery })}
          <br />
          {t('Only the first X incidents will be retrieved', { maxIncidentsLimit })}
          <br />
          <br />
          {t('Continue')}
          ?
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
            {t('Retrieve Incidents')}
          </Button>
          <Button id="cancel-incident-query-button" variant="danger" onClick={handleCancel}>
            {t('Cancel')}
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
