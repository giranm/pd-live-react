import {
  acceptDisclaimer,
} from '../../support/util/common';

describe('Manage Open Incidents', () => {
  // We use beforeEach as each test will reload/clear the session
  beforeEach(() => {
    acceptDisclaimer();
  });
  it('Acknowledge first incident', () => {
    cy.visit('/');
    cy.get('[data-incident-row-idx="0"]', { timeout: 20000 }).click();
    cy.get('#incident-action-acknowledge-button').click();
    cy.get('.action-alerts-modal').contains('have been acknowledged', { timeout: 10000 });
  });
});
