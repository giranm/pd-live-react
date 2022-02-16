/* eslint-disable cypress/no-unnecessary-waiting */
import {
  acceptDisclaimer, waitForIncidentTable,
} from '../../support/util/common';

describe('Search Incidents', { failFast: { enabled: false } }, () => {
  beforeEach(() => {
    acceptDisclaimer();
    waitForIncidentTable();
  });

  it('Search for `Service A1` returns incidents only on Service A1', () => {
    cy.get('#global-search-input').type('Service A1');
    cy.wait(5000);
    cy.get('[data-incident-header="Service"]').each(($el) => {
      cy.wrap($el).should('have.text', 'Service A1');
    });
  });

  it('Search for `zzzzzz` returns no incidents', () => {
    cy.get('#global-search-input').type('zzzzzz');
    cy.wait(5000);
    cy.get('.empty-incidents-badge').should('be.visible');
  });
});
