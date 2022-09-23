import '../../i18n';

import {
  mockStore, componentWrapper,
} from 'mocks/store.test';

import {
  MAX_INCIDENTS_LIMIT_LOWER,
} from 'config/constants';

import {
  generateRandomInteger,
} from 'util/helpers';

import ConfirmQueryModalComponent from './ConfirmQueryModalComponent';

describe('ConfirmQueryModalComponent', () => {
  it('should render modal noting max incident limit has been reached', () => {
    const limit = MAX_INCIDENTS_LIMIT_LOWER;
    const totalIncidentsFromQuery = generateRandomInteger(limit + 1, limit * 2);
    const store = mockStore({
      settings: {
        maxIncidentsLimit: limit,
      },
      querySettings: {
        displayConfirmQueryModal: true,
        totalIncidentsFromQuery,
      },
    });

    const wrapper = componentWrapper(store, ConfirmQueryModalComponent);
    expect(wrapper.find('.modal-title').at(0).getDOMNode().textContent).toEqual(
      'Max Incidents Limit Reached',
    );
    expect(wrapper.find('.modal-body').at(0).getDOMNode().textContent).toEqual(
      [
        `Current query parameters match ${totalIncidentsFromQuery} incidents.`,
        `Only the first ${limit} incidents will be retrieved. Continue?`,
      ].join(' '),
    );
  });
});
