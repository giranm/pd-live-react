import {
  Badge,
} from 'react-bootstrap';

import {
  useTranslation,
} from 'react-i18next';

import {
  ReactComponent as EmptyIncidents,
} from 'assets/images/empty_incidents.svg';

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
