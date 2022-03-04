import {
  Badge,
} from 'react-bootstrap';
import {
  ReactComponent as EmptyIncidents,
} from 'assets/images/empty_incidents.svg';

const EmptyIncidentsComponent = () => (
  <div className="empty-incidents">
    <EmptyIncidents />
    <h1 className="empty-incidents-badge">
      <Badge bg="primary">No Incidents Found</Badge>
    </h1>
  </div>
);

export default EmptyIncidentsComponent;
