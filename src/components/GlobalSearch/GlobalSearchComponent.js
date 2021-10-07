import { connect } from 'react-redux';
import {
  Row,
  Col,
  Form,
  InputGroup,
} from 'react-bootstrap';

import { ReactComponent as SearchGlass } from 'assets/images/search_glass.svg';

import './GlobalSearchComponent.css';

import { updateSearchQuery } from 'redux/query_settings/actions';

const GlobalSearchComponent = ({ updateSearchQuery }) => (
  <div className="global-search-ctr">
    <Row>
      <Col>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>
              <SearchGlass />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            placeholder="Search"
            htmlSize={40}
            onChange={(e) => updateSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Col>
    </Row>
  </div>
);

const mapDispatchToProps = (dispatch) => ({
  updateSearchQuery: (searchQuery) => dispatch(updateSearchQuery(searchQuery)),
});

export default connect(null, mapDispatchToProps)(GlobalSearchComponent);
