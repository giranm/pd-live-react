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
