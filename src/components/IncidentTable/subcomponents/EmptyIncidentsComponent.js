import {
  Badge,
} from 'react-bootstrap';
import {
  ReactComponent as EmptyIncidents,
} from 'assets/images/empty_incidents.svg';
import {
  useTranslation,
} from 'react-i18next';

const EmptyIncidentsComponent = () => {
  const {
    t,
  } = useTranslation();
  return (
    <div className="empty-incidents">
      <EmptyIncidents />
      <h1 className="empty-incidents-badge">
        <Badge bg="primary">{t('No Incidents Found')}</Badge>
      </h1>
    </div>
  );
};

export default EmptyIncidentsComponent;
