import {
  mockStore, componentWrapper,
} from 'mocks/store.test';

import {
  MAX_INCIDENTS_LIMIT,
} from 'config/constants';

import ConfirmQueryModalComponent from './ConfirmQueryModalComponent';

describe('ConfirmQueryModalComponent', () => {
  it('should render modal noting max incident limit has been reached', () => {
    const totalIncidentsFromQuery = Math.floor(Math.random() * 200 + 200);
    const store = mockStore({
      querySettings: {
        displayConfirmQueryModal: true,
        totalIncidentsFromQuery,
      },
    });
    const wrapper = componentWrapper(store, ConfirmQueryModalComponent);
    expect(wrapper.contains('Max Incidents Limit Reached')).toBeTruthy();
    expect(wrapper.find('.modal-body').at(0).getDOMNode().textContent).toEqual(
      [
        `Current query parameters match\u00A0${totalIncidentsFromQuery}\u00A0incidents.`,
        `Only the first\u00A0${MAX_INCIDENTS_LIMIT}\u00A0incidents will be retrieved.Continue?`,
      ].join(''),
    );
  });
});
