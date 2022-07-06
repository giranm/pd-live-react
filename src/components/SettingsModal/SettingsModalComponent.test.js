import '@testing-library/jest-dom';

import {
  mockStore, componentWrapper,
} from 'mocks/store.test';

import {
  defaultSinceDateTenors,
} from 'util/settings';

import SettingsModalComponent from './SettingsModalComponent';

describe('SettingsModalComponent', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      settings: {
        displaySettingsModal: true,
        defaultSinceDateTenor: '1 Day',
      },
      incidentTable: {
        incidentTableColumns: [],
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

    // FIXME: Determine correct way to click DOM with Jest - this does not update internal state
    tabElement.simulate('click');
    expect(tabElement.prop('aria-selected')).toBeTruthy();
    expect(tabElement.contains('User Profile')).toBeTruthy();

    expect(wrapper.find('#user-profile-locale-label').contains('Locale')).toBeTruthy();
    // NB: [class*="singleValue"] selector doesn't work here - have to workaround this
    expect(
      wrapper
        .findWhere((n) => (typeof n.prop('className') === 'string'
          ? n.prop('className').includes('singleValue')
          : false))
        .contains('English (United Kingdom)'),
    ).toBeTruthy();

    expect(
      wrapper
        .find('#user-profile-default-since-date-tenor-label')
        .contains('Default Since Date Lookback'),
    ).toBeTruthy();
    expect(wrapper.find('input[value="1 Day"]').prop('checked')).toBeTruthy();
    defaultSinceDateTenors.forEach((tenor) => {
      expect(wrapper.find(`input[value="${tenor}"]`).getDOMNode()).toBeVisible();
    });

    expect(
      wrapper.find('#update-user-profile-button').contains('Update User Profile'),
    ).toBeTruthy();
  });

  it('should display incident table settings', () => {
    const wrapper = componentWrapper(store, SettingsModalComponent);
    const tabSelector = 'a[data-rb-event-key="incident-table-columns"]';
    const tabElement = wrapper.find(tabSelector);

    // FIXME: Determine correct way to click DOM with Jest - this does not update internal state
    tabElement.simulate('click');
    expect(tabElement.contains('Incident Table Columns')).toBeTruthy();
    expect(
      wrapper.find('#update-incident-table-columns-button').contains('Update Columns'),
    ).toBeTruthy();
  });

  it('should display local cache settings', () => {
    const wrapper = componentWrapper(store, SettingsModalComponent);
    const tabSelector = 'a[data-rb-event-key="local-cache"]';
    const tabElement = wrapper.find(tabSelector);

    // FIXME: Determine correct way to click DOM with Jest - this does not update internal state
    tabElement.simulate('click');
    expect(tabElement.contains('Local Cache')).toBeTruthy();
    expect(wrapper.find('#clear-local-cache-button').contains('Clear Local Cache')).toBeTruthy();
  });
});
