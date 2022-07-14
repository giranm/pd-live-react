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
        alertCustomDetailFields: [
          {
            label: 'Summary:details.to.some.path',
            value: 'Summary:details.to.some.path',
            columnType: 'alert',
          },
          {
            label: 'CustomField:details.to.some.path',
            value: 'CustomField:details.to.some.path',
            columnType: 'alert',
          },
        ],
      },
      incidentTable: {
        incidentTableColumns: [
          { Header: '#', accessorPath: null, columnType: 'incident' },
          { Header: 'Summary', accessorPath: null, columnType: 'incident' },
        ],
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
    const tabSelector = 'a[data-rb-event-key="incident-table"]';
    const tabElement = wrapper.find(tabSelector);

    // FIXME: Determine correct way to click DOM with Jest - this does not update internal state
    tabElement.simulate('click');
    expect(tabElement.contains('Incident Table')).toBeTruthy();
    expect(wrapper.find('h4').contains('Column Selector')).toBeTruthy();
    expect(wrapper.find('#incident-column-select')).toBeTruthy();
    expect(wrapper.find('h4').contains('Alert Custom Detail Column Definitions')).toBeTruthy();
    expect(wrapper.find('#alert-column-definition-select')).toBeTruthy();
    expect(
      wrapper.find('#update-incident-table-button').contains('Update Incident Table'),
    ).toBeTruthy();
  });

  it('should render an enabled custom column option with unique header name', () => {
    const wrapper = componentWrapper(store, SettingsModalComponent);
    const tabSelector = 'a[data-rb-event-key="incident-table"]';
    const tabElement = wrapper.find(tabSelector);
    tabElement.simulate('click');
    expect(wrapper.find('[value="CustomField:details.to.some.path"]').prop('disabled')).toEqual(
      undefined,
    );
  });

  it('should render a disabled custom column option which has a duplicate header/name', () => {
    const wrapper = componentWrapper(store, SettingsModalComponent);
    const tabSelector = 'a[data-rb-event-key="incident-table"]';
    const tabElement = wrapper.find(tabSelector);
    tabElement.simulate('click');
    expect(wrapper.find('[value="Summary:details.to.some.path"]').prop('disabled')).toEqual(true);
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
