import {
  acceptDisclaimer,
} from '../support/util/common';

describe('PagerDuty Live', () => {
  before(() => {
    acceptDisclaimer();
  });
  it('Renders the main application page', () => {
    cy.visit('/');
    cy.get('.navbar-ctr').contains('Live Incidents Console');
  });
});
