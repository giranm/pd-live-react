import {
  Provider,
} from 'react-redux';
import configureStore from 'redux-mock-store';
import {
  mount,
} from 'enzyme';

export const mockStore = configureStore([]);

export const componentWrapper = (store, Component) => mount(
  <Provider store={store}>
    <Component />
  </Provider>,
);

// Ref: https://stackoverflow.com/a/59864054/6480733 - required for test mocking
test.skip('Helper store specific for testing', () => 1);
