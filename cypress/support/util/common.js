/* eslint-disable import/prefer-default-export */
import {
  api,
} from '@pagerduty/pdjs';

export const pd = api({ token: Cypress.env('PD_USER_TOKEN') });

/*
  Cypress Helpers
*/
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
  cy.get(`[data-incident-row-idx="${incidentIdx}"]`).click();
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

export const deactivateButtonIfActive = (domId) => {
  cy.get(`#${domId}`).then(($el) => {
    const cls = $el.attr('class');
    if (cls.includes('active')) {
      cy.wrap($el).click().should('not.have.class', 'active');
    }
  });
};

export const activateButtonIfDeactive = (domId) => {
  cy.get(`#${domId}`).then(($el) => {
    const cls = $el.attr('class');
    if (!cls.includes('active')) {
      cy.wrap($el).click().should('have.class', 'active');
    }
  });
};

export const escalate = (escalationLevel) => {
  cy.get('#incident-action-escalate-button').click();
  cy.get(`#escalation-level-${escalationLevel}-button`).click();
};

export const reassign = (assignment) => {
  cy.get('#incident-action-reassign-button').click();
  cy.get('#reassign-select').click();
  cy.contains('div', assignment).click();
  cy.get('#reassign-button').click();
};

export const addResponders = (responders = [], message = null) => {
  cy.get('#incident-action-add-responders-button').click();
  responders.forEach((responder) => {
    cy.get('#add-responders-select').click();
    cy.contains('div', responder).click();
  });
  if (message) cy.get('#add-responders-textarea').type(message);
  cy.get('#add-responders-button').click();
};

export const addNote = (note) => {
  cy.get('#incident-action-add-note-button').click();
  cy.get('#add-note-textarea').type(note);
  cy.get('#add-note-button').click();
};

/*
  PagerDuty API Helpers
*/

// TODO: Figure out how to query API and use incident object for comparison
export const getIncident = (incidentId) => {
  pd.get(`incidents/${incidentId}`).then(({
    data,
  }) => {
    cy.window().then((win) => {
      win.sessionStorage.setItem('incident', data.incident);
    });
  });
};
