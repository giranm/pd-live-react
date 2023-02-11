import {
  connect,
} from 'react-redux';

import {
  OverlayTrigger, Tooltip,
} from 'react-bootstrap';

import i18next from 'i18n';

import Beacon from './subcomponents/Beacon';

const StatusBeaconComponent = ({
  connectionStatus, connectionStatusMessage, queueStats,
}) => {
  const waiting = queueStats.RECEIVED + queueStats.QUEUED;
  const running = queueStats.RUNNING + queueStats.EXECUTING;

  const queueStatsStr = `${waiting} ${i18next.t('waiting')}, ${running} ${i18next.t('running')}`;
  return (
    <div className="status-beacon-ctr">
      <OverlayTrigger
        placement="bottom"
        // eslint-disable-next-line
        overlay={<Tooltip className="status-beacon-connection"><>{i18next.t('Status')}: {connectionStatusMessage}<br/>{queueStatsStr}</></Tooltip>}
      >
        <Beacon status={connectionStatus} speed="normal" size="1.2em" />
      </OverlayTrigger>
    </div>
  );
};

const mapStateToProps = (state) => ({
  connectionStatus: state.connection.connectionStatus,
  connectionStatusMessage: state.connection.connectionStatusMessage,
  queueStats: state.connection.queueStats,
});

export default connect(mapStateToProps)(StatusBeaconComponent);
