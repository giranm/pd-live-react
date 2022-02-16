/* eslint-disable cypress/no-unnecessary-waiting */
import {
  acceptDisclaimer,
  waitForIncidentTable,
  manageIncidentTableColumns,
} from '../../support/util/common';

describe('Manage Settings', { failFast: { enabled: false } }, () => {
  beforeEach(() => {
    acceptDisclaimer();
    waitForIncidentTable();
  });

  it('Add columns to incident table', () => {
    const columns = ['Teams', 'Num Alerts'];
    manageIncidentTableColumns('add', columns);
    columns.forEach((columnName) => {
      cy.get('.th').contains(columnName).scrollIntoView().should('be.visible');
    });
  });

  // FIXME: Find out way to properly remove columns using DOM
  it('Remove columns from incident table', () => {
    const columns = ['Service', 'Latest Note'];
    manageIncidentTableColumns('remove', columns);
    columns.forEach((columnName) => {
      cy.get('.th').contains(columnName).scrollIntoView().should('not.be.visible');
    });
  });
});
