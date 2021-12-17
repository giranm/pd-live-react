import { connect } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';

import {
  Row,
  Col,
  Form,
  InputGroup,
} from 'react-bootstrap';

import { ReactComponent as SearchGlass } from 'assets/images/search_glass.svg';

import './GlobalSearchComponent.scss';

import { updateSearchQuery as updateSearchQueryConnected } from 'redux/query_settings/actions';

const GlobalSearchComponent = ({ searchQuery, updateSearchQuery }) => {
  const debounced = useDebouncedCallback(
    (value) => {
      updateSearchQuery(value);
    },
    500,
  );
  return (
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
              onChange={(e) => debounced(e.target.value)}
              defaultValue={searchQuery}
              style={searchQuery ? {
                backgroundColor: '#ffdc00',
                color: '#1155e6',
                fontWeight: 600,
              } : {}}
            />
          </InputGroup>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchQuery: state.querySettings.searchQuery,
});

const mapDispatchToProps = (dispatch) => ({
  updateSearchQuery: (searchQuery) => dispatch(updateSearchQueryConnected(searchQuery)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearchComponent);
