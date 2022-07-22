import {
  mockStore, componentWrapper,
} from 'mocks/store.test';

import {
  MAX_INCIDENTS_LIMIT,
} from 'config/constants';

import {
  generateRandomInteger,
} from 'util/helpers';

import ConfirmQueryModalComponent from './ConfirmQueryModalComponent';

describe('ConfirmQueryModalComponent', () => {
  it('should render modal noting max incident limit has been reached', () => {
    const totalIncidentsFromQuery = generateRandomInteger(
      MAX_INCIDENTS_LIMIT + 1,
      MAX_INCIDENTS_LIMIT * 2,
    );
    const store = mockStore({
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
        `Current query parameters match\u00A0${totalIncidentsFromQuery}\u00A0incidents.`,
        `Only the first\u00A0${MAX_INCIDENTS_LIMIT}\u00A0incidents will be retrieved.Continue?`,
      ].join(''),
    );
  });
});
