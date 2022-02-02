import {
  connect,
} from 'react-redux';

import {
  OverlayTrigger, Tooltip,
} from 'react-bootstrap';

import Beacon from './subcomponents/Beacon';

const StatusBeaconComponent = ({
  connectionStatus, connectionStatusMessage,
}) => (
  <div className="status-beacon-ctr">
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip className="status-beacon-connection">{connectionStatusMessage}</Tooltip>}
    >
      <Beacon status={connectionStatus} speed="normal" size="1.2em" />
    </OverlayTrigger>
  </div>
);

const mapStateToProps = (state) => ({
  connectionStatus: state.connection.connectionStatus,
  connectionStatusMessage: state.connection.connectionStatusMessage,
});

export default connect(mapStateToProps)(StatusBeaconComponent);
