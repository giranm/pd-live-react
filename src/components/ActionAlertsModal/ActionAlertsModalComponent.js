import {
  connect,
} from 'react-redux';

import {
  Modal, Alert,
} from 'react-bootstrap';

import {
  toggleDisplayActionAlertsModal as toggleDisplayActionAlertsModalConnected,
} from 'redux/action_alerts/actions';

import './ActionAlertsModelComponent.scss';

const ActionAlertsModalComponent = ({
  toggleDisplayActionAlertsModal, actionAlertsModalData,
}) => {
  const {
    displayActionAlertsModal, actionAlertsModalType, actionAlertsModalMessage,
  } = actionAlertsModalData;

  return (
    <div className="action-alerts-modal-ctr">
      <Modal show={displayActionAlertsModal} onHide={toggleDisplayActionAlertsModal}>
        <Alert className="action-alerts-modal" variant={actionAlertsModalType}>
          {actionAlertsModalMessage}
        </Alert>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  actionAlertsModalData: state.actionAlertsModalData,
});

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayActionAlertsModal: () => dispatch(toggleDisplayActionAlertsModalConnected()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActionAlertsModalComponent);
