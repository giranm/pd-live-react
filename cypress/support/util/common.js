/* eslint-disable import/prefer-default-export */

export const acceptDisclaimer = () => {
  cy.visit('/');
  cy.get('#disclaimer-agree-checkbox').click();
  cy.get('#disclaimer-accept-button').click();
};
