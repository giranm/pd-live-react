/* eslint-disable import/prefer-default-export */

export const acceptDisclaimer = () => {
  cy.visit('/', {
    onBeforeLoad: (win) => {
      win.sessionStorage.clear();
    },
  });
  cy.get('.modal-title', { timeout: 30000 }).contains('Disclaimer & License');
  cy.get('#disclaimer-agree-checkbox').click();
  cy.get('#disclaimer-accept-button').click();
};

export const waitForIncidentTable = () => {
  // Ref: https://stackoverflow.com/a/60065672/6480733
  cy.get('.incident-table-ctr', { timeout: 30000 }).should('be.visible');
};

export const selectIncident = (incidentIdx = 0) => {
  cy.get(`[data-incident-row-idx="${incidentIdx}"]`, { timeout: 20000 }).click();
};

export const selectAllIncidents = () => {
  cy.get('#all-incidents-checkbox', { timeout: 20000 }).click();
};

export const checkActionAlertsModalContent = (content) => {
  cy.get('.action-alerts-modal').contains(content, { timeout: 10000 });
  cy.get('.action-alerts-modal').type('{esc}');
};

export const checkIncidentCellContent = (incidentHeader, incidentIdx, content) => {
  cy.get(`[data-incident-header="${incidentHeader}"][data-incident-row-cell-idx="${incidentIdx}"]`)
    .should('be.visible')
    .should('have.text', content);
};

export const addNote = (note) => {
  cy.get('#incident-action-add-note-button').click();
  cy.get('#add-note-textarea').type(note);
  cy.get('#add-note-button').click();
};
