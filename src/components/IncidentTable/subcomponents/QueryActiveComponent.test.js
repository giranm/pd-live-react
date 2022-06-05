import {
  mockStore, componentWrapper,
} from 'mocks/store.test';

import QueryActiveComponent from './QueryActiveComponent';

describe('QueryActiveComponent', () => {
  it('should render component with contents="Querying PagerDuty API"', () => {
    const store = mockStore({});
    const wrapper = componentWrapper(store, QueryActiveComponent);
    expect(wrapper.contains('Querying PagerDuty API')).toBeTruthy();
  });
});
