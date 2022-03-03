import '@testing-library/jest-dom';
import gb from 'date-fns/locale/en-GB';

import moment from 'moment';

import {
  registerLocale,
} from 'react-datepicker';

import {
  mockStore, componentWrapper,
} from 'mocks/store.test';

import QuerySettingsComponent from './QuerySettingsComponent';

describe('QuerySettingsComponent', () => {
  let store;
  const defaultSinceDateTenor = '1 Day';
  const currentUserLocale = 'en-GB';
  registerLocale(currentUserLocale, gb);
  moment.locale(currentUserLocale);

  beforeEach(() => {
    store = mockStore({
      querySettings: {
        displayQuerySettings: true,
        incidentStatus: ['Triggered'],
        incidentUrgency: ['High'],
        incidentPriority: ['PXYZABC'],
        teamIds: [],
        serviceIds: [],
      },
      services: { services: [{ name: 'TestService', id: 'PXYZABC' }] },
      teams: { teams: [{ name: 'TestTeam', id: 'PXYZABC' }] },
      priorities: { priorities: [{ name: 'P1', id: 'PXYZABC', color: '000000' }] },
      users: {
        currentUserLocale,
      },
      settings: {
        defaultSinceDateTenor,
      },
    });
  });

  it('should render component', () => {
    // NB: Jest doesn't properly identify if react-bootstrap el is not visible, see workaround below
    const wrapper = componentWrapper(store, QuerySettingsComponent);
    expect(wrapper.find('#query-settings-accordion').at(0).getDOMNode().className).toEqual(
      'collapse show',
    );
  });

  it('should render correct since date based on defaultSinceDateTenor', () => {
    const [sinceDateNum, sinceDateTenor] = defaultSinceDateTenor.split(' ');
    const expectedDate = moment().subtract(Number(sinceDateNum), sinceDateTenor).format('L');
    const wrapper = componentWrapper(store, QuerySettingsComponent);
    expect(wrapper.find('#query-date-input').hostNodes().prop('value')).toEqual(expectedDate);
  });
});
