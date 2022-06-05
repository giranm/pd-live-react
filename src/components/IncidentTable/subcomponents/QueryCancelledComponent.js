import {
  Container, Row, Alert,
} from 'react-bootstrap';

const QueryCancelledComponent = () => (
  <Container fluid>
    <br />
    <Row className="justify-content-md-center">
      <Alert variant="warning">
        <h4>
          <b>Query has been cancelled by user</b>
        </h4>
      </Alert>
    </Row>
  </Container>
);

export default QueryCancelledComponent;
