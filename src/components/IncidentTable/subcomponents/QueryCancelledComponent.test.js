import {
  mockStore, componentWrapper,
} from 'mocks/store.test';

import QueryCancelledComponent from './QueryCancelledComponent';

describe('QueryCancelledComponent', () => {
  it('should render component with contents="Query has been cancelled by user"', () => {
    const store = mockStore({});
    const wrapper = componentWrapper(store, QueryCancelledComponent);
    expect(wrapper.contains('Query has been cancelled by user')).toBeTruthy();
  });
});
