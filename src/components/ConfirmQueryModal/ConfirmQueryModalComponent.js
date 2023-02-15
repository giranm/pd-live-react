import {
  connect,
} from 'react-redux';

import {
  Modal, Button,
} from 'react-bootstrap';

import {
  useTranslation,
} from 'react-i18next';

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
    t,
  } = useTranslation();
  const {
    // eslint-disable-next-line no-unused-vars
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
          {'. '}
          <br />
          {t('Retrieving notes and alerts could take a long time')}
          {'. '}
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
