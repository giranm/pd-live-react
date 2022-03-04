import {
  mockStore, componentWrapper,
} from 'mocks/store.test';

import ActionAlertsModalComponent from './ActionAlertsModalComponent';

describe('ActionAlertsModalComponent', () => {
  it('should render success modal with contents="winning"', () => {
    const store = mockStore({
      actionAlertsModalData: {
        displayActionAlertsModal: true,
        actionAlertsModalType: 'success',
        actionAlertsModalMessage: 'winning',
      },
    });
    const wrapper = componentWrapper(store, ActionAlertsModalComponent);
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
    const wrapper = componentWrapper(store, ActionAlertsModalComponent);
    expect(wrapper.find('div.action-alerts-modal').hasClass('alert-danger')).toBeTruthy();
    expect(wrapper.contains('failing')).toBeTruthy();
  });
});
