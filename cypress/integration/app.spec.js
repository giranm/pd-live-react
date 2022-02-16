import {
  acceptDisclaimer, waitForIncidentTable, pd,
} from '../support/util/common';

import packageConfig from '../../package.json';

describe('Integration User Token', { failFast: { enabled: false } }, () => {
  before(() => {
    expect(Cypress.env('PD_USER_TOKEN')).to.be.a('string');
    cy.intercept('GET', 'https://api.pagerduty.com/users/me').as('getCurrentUser');
  });

  it('Valid integration user token present', () => {
    pd.get('users/me')
      .then(({
        data,
      }) => {
        // eslint-disable-next-line no-unused-expressions
        expect(data).to.exist;
      })
      .catch((err) => {
        // Terminate Cypress tests if invalid token detected
        expect(err.status).to.equal(200);
      });
    cy.wait('@getCurrentUser', { timeout: 10000 });
  });
});

describe('PagerDuty Live', () => {
  beforeEach(() => {
    acceptDisclaimer();
    waitForIncidentTable();
  });

  it('Renders the main application page', () => {
    cy.get('.navbar-ctr').contains('Live Incidents Console');
  });

  it('Application indicates when the required ability is available on the account', () => {
    cy.get('.status-beacon-ctr').trigger('mouseover');
    cy.get('.status-beacon-connection').should('be.visible');
    cy.get('.status-beacon-connection').contains('Connected', { timeout: 30000 });
  });

  it('Application indicates when the required ability is missing/disabled on the account', () => {
    // Intercept call to PagerDuty API with mock fixture
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

  it('Renders the correct version from package.json', () => {
    cy.get('.settings-panel-dropdown').click();
    cy.get('.version-info').should('be.visible');
    cy.get('.version-info').contains(`Version: ${packageConfig.version}`);
  });
});
