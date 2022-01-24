/* eslint-disable import/prefer-default-export */

export const acceptDisclaimer = () => {
  cy.visit('/');
  cy.get('.modal-title', { timeout: 30000 }).contains('Disclaimer & License');
  cy.get('#disclaimer-agree-checkbox').click();
  cy.get('#disclaimer-accept-button').click();
};

export const waitForIncidentTable = () => {
  // Ref: https://stackoverflow.com/a/60065672/6480733
  cy.get('.incident-table-ctr', { timeout: 30000 }).should('be.visible');
};
