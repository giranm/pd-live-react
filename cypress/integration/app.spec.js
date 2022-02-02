import {
  acceptDisclaimer,
} from '../support/util/common';

describe('PagerDuty Live', () => {
  beforeEach(() => {
    acceptDisclaimer();
  });

  it('Renders the main application page', () => {
    cy.visit('/');
    cy.get('.navbar-ctr').contains('Live Incidents Console');
  });

  // FIXME: Both tests work in headful mode but fail in headless
  it('Application indicates when the required ability is available on the account', () => {
    cy.visit('/');
    cy.get('.status-beacon-ctr').trigger('mouseover');
    cy.get('.status-beacon-connection').should('be.visible');
    cy.get('.status-beacon-connection').contains('Connected', { timeout: 15000 });
  });

  it('Application indicates when the required ability is missing/disabled on the account', () => {
    // Intercept call to PagerDuty API with mock fixture
    cy.visit('/');
    cy.intercept('https://api.pagerduty.com/abilities', {
      abilities: ['teams', 'read_only_users', 'service_support_hours', 'urgencies'],
    }).as('getAbilities');
    cy.wait('@getAbilities', { timeout: 30000 });

    // The mock response will render an error in the application
    cy.get('.status-beacon-ctr').trigger('mouseover');
    cy.get('.status-beacon-connection').should('be.visible');
    cy.get('.status-beacon-connection').contains(
      'Current subdomain does not have the correct ability to use PagerDuty Live',
    );
  });
});
