import '../../../i18n';

import {
  shallow,
} from 'enzyme';

import {
  Alert,
} from 'react-bootstrap';

import QueryCancelledComponent from './QueryCancelledComponent';

describe('QueryCancelledComponent', () => {
  it('should render component with contents="Query has been cancelled by user"', () => {
    const wrapper = shallow(<QueryCancelledComponent />);
    expect(wrapper.find(Alert).getElement(0).props.variant).toEqual('warning');
    expect(wrapper.contains('Query has been cancelled by user')).toBeTruthy();
  });
});
