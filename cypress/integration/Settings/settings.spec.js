/* eslint-disable cypress/no-unnecessary-waiting */
import {
  acceptDisclaimer,
  waitForIncidentTable,
  manageIncidentTableColumns,
  activateButton,
  priorityNames,
} from '../../support/util/common';

describe('Manage Settings', { failFast: { enabled: false } }, () => {
  before(() => {
    acceptDisclaimer();
    priorityNames.forEach((currentPriority) => {
      activateButton(`query-priority-${currentPriority}-button`);
    });
    waitForIncidentTable();
  });

  beforeEach(() => {
    if (cy.state('test').currentRetry() > 1) {
      acceptDisclaimer();
    }
    priorityNames.forEach((currentPriority) => {
      activateButton(`query-priority-${currentPriority}-button`);
    });
    waitForIncidentTable();
  });

  it('Add columns to incident table', () => {
    const columns = ['Teams', 'Num Alerts'];
    manageIncidentTableColumns('add', columns);
    columns.forEach((columnName) => {
      cy.get(`[data-column-name="${columnName}"]`).scrollIntoView().should('be.visible');
    });
  });

  it('Remove columns from incident table', () => {
    const columns = ['Service', 'Latest Note'];
    manageIncidentTableColumns('remove', columns);

    // Assert against DOM to see if element has been removed
    cy.get('body').then((body) => {
      columns.forEach((columnName) => {
        expect(body.find(`[data-column-name="${columnName}"]`).length).to.equal(0);
      });
    });
  });

  it('Clear local cache', () => {
    cy.get('.settings-panel-dropdown').click();
    cy.get('.dropdown-item').contains('Settings').click();
    cy.get('.nav-item').contains('Local Cache').click();
    cy.get('.btn').contains('Clear Local Cache').click();
    cy.get('.modal-title').contains('Disclaimer & License').should('be.visible');
  });
});
