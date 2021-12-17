import { connect } from 'react-redux';

import { Modal } from 'react-bootstrap';

import PDOAuth from 'util/pdoauth';

import { userAcceptDisclaimer as userAcceptDisclaimerConnected } from 'redux/users/actions';

const UnauthorizedModalComponent = ({
  users,
  userAcceptDisclaimer,
}) => {
  const { userAuthorized } = users;

  return (
    <div className="user-unauthorized-modal-ctr">
      <Modal
        dialogClassName="modal-60w"
        show={!userAuthorized}
        onHide={() => {
          userAcceptDisclaimer();
          PDOAuth.logout();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Unauthorized Access</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            User is not permitted to access this instance of PagerDuty Live.
            Please contact the associated site owner for access.
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

const mapDispatchToProps = (dispatch) => ({
  userAcceptDisclaimer: () => dispatch(userAcceptDisclaimerConnected()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UnauthorizedModalComponent);
