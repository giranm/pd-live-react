import {
  Container, Row, Spinner,
} from 'react-bootstrap';

const QueryActiveComponent = () => (
  <Container id="query-active-ctr" fluid>
    <br />
    <Row className="justify-content-md-center">
      <Spinner className="" animation="border" role="status" variant="success" />
      <h5 className="querying-incidents">
        <b>Querying PagerDuty API</b>
      </h5>
    </Row>
  </Container>
);

export default QueryActiveComponent;
