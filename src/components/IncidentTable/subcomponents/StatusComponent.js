/* eslint-disable consistent-return */
import {
  Badge, OverlayTrigger, Tooltip,
} from 'react-bootstrap';

import {
  FontAwesomeIcon,
} from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faShieldAlt,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  TRIGGERED, ACKNOWLEDGED, RESOLVED,
} from 'util/incidents';

const InternalStatusComponent = (tooltip, variant, icon) => (
  <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip}</Tooltip>}>
    <Badge className="status-badge" variant={variant}>
      <FontAwesomeIcon icon={icon} />
    </Badge>
  </OverlayTrigger>
);

const StatusComponent = ({
  status,
}) => {
  if (status === TRIGGERED) {
    return InternalStatusComponent('Triggered', 'danger', faExclamationTriangle);
  }
  if (status === ACKNOWLEDGED) {
    return InternalStatusComponent('Acknowledged', 'warning', faShieldAlt);
  }
  if (status === RESOLVED) {
    return InternalStatusComponent('Resolved', 'success', faCheckCircle);
  }
};

export default StatusComponent;
