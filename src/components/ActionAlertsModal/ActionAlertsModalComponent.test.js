import {
  Provider,
} from 'react-redux';
import configureStore from 'redux-mock-store';
import {
  mount,
} from 'enzyme';

import ActionAlertsModalComponent from './ActionAlertsModalComponent';

const mockStore = configureStore([]);

const componentWrapper = (store) => mount(
  <Provider store={store}>
    <ActionAlertsModalComponent />
  </Provider>,
);

describe('ActionAlertsModalComponent', () => {
  it('should render success modal with contents="winning"', () => {
    const store = mockStore({
      actionAlertsModalData: {
        displayActionAlertsModal: true,
        actionAlertsModalType: 'success',
        actionAlertsModalMessage: 'winning',
      },
    });
    const wrapper = componentWrapper(store);
    expect(wrapper.find('div.action-alerts-modal').hasClass('alert-success')).toBeTruthy();
    expect(wrapper.contains('winning')).toBeTruthy();
  });

  it('should render error modal with contents="failing"', () => {
    const store = mockStore({
      actionAlertsModalData: {
        displayActionAlertsModal: true,
        actionAlertsModalType: 'danger',
        actionAlertsModalMessage: 'failing',
      },
    });
    const wrapper = componentWrapper(store);
    expect(wrapper.find('div.action-alerts-modal').hasClass('alert-danger')).toBeTruthy();
    expect(wrapper.contains('failing')).toBeTruthy();
  });
});
