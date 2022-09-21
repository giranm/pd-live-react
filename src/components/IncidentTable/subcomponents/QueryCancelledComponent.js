import {
  Container, Row, Alert,
} from 'react-bootstrap';
import {
  useTranslation,
} from 'react-i18next';

const QueryCancelledComponent = () => {
  const {
    t,
  } = useTranslation();
  return (
    <Container className="query-cancelled-ctr" fluid>
      <br />
      <Row className="justify-content-md-center">
        <Alert variant="warning">
          <h4>
            <b>{t('Query has been cancelled by user')}</b>
          </h4>
        </Alert>
      </Row>
    </Container>
  );
};

export default QueryCancelledComponent;
