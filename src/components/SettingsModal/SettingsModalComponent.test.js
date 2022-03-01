import {
  mockStore, componentWrapper,
} from 'mocks/store.test';

import userEvent from '@testing-library/user-event';

import SettingsModalComponent from './SettingsModalComponent';

describe('SettingsModalComponent', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      settings: {
        displaySettingsModal: true,
      },
      incidentTable: {
        incidentTableColumnsNames: [],
      },
      users: {
        currentUserLocale: 'en-GB',
      },
    });
  });

  it('should render modal', () => {
    const wrapper = componentWrapper(store, SettingsModalComponent);
    expect(wrapper.find('.modal-title').contains('Settings')).toBeTruthy();
  });

  it('should display user profile settings', () => {
    const wrapper = componentWrapper(store, SettingsModalComponent);
    const tabSelector = 'a[data-rb-event-key="user-profile"]';
    const tabElement = wrapper.find(tabSelector);

    tabElement.simulate('click');
    expect(tabElement.prop('aria-selected')).toBeTruthy();
    expect(tabElement.contains('User Profile')).toBeTruthy();

    expect(wrapper.find('#user-profile-locale-label').contains('Locale')).toBeTruthy();
    // console.log(wrapper.find('div[class$="-singleValue"]').length); // TODO: Find out why DOM not detected.
    // expect(
    //   wrapper.find('[class*="-singleValue"]').contains('English (United Kingdom)'),
    // ).toBeTruthy();
  });

  it('should display incident table settings', () => {
    const wrapper = componentWrapper(store, SettingsModalComponent);
    const tabSelector = 'a[data-rb-event-key="incident-table-columns"]';
    const tabElement = wrapper.find(tabSelector);
    expect(tabElement.contains('Incident Table Columns')).toBeTruthy();

    // FIXME: Determine correct way to click DOM with Jest
    // userEvent.click(tabElement);
    // // tabElement.simulate('click');
    // expect(tabElement.prop('aria-selected')).toBeTruthy();
  });
});
