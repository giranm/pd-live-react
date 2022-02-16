/* eslint-disable cypress/no-unnecessary-waiting */
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
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
  cy.get('.action-alerts-modal').contains(content, { timeout: 10000 });
  cy.get('.action-alerts-modal').type('{esc}');
};

export const checkIncidentCellContent = (incidentHeader, incidentIdx, content) => {
  cy.wait(2000);
  cy.get(`[data-incident-header="${incidentHeader}"][data-incident-row-cell-idx="${incidentIdx}"]`)
    .should('be.visible')
    .should('have.text', content);
};

export const checkIncidentCellIcon = (incidentHeader, incidentIdx, icon) => {
  cy.wait(2000);
  cy.get(
    `[data-incident-header="${incidentHeader}"][data-incident-row-cell-idx="${incidentIdx}"]`,
  ).within(() => {
    cy.get('svg').then(($el) => {
      cy.wrap($el).should('have.class', icon);
    });
  });
};

export const deactivateButton = (domId) => {
  cy.get(`#${domId}`).then(($el) => {
    const cls = $el.attr('class');
    if (cls.includes('active')) {
      cy.wrap($el).click().should('not.have.class', 'active');
    }
  });
};

export const activateButton = (domId) => {
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

export const snooze = (duration) => {
  cy.get('#incident-action-snooze-button').click();
  cy.get('.dropdown-item').contains(duration).click();
};

export const snoozeCustom = (type, option) => {
  cy.get('#incident-action-snooze-button').click();
  cy.get('#snooze-duration-custom-modal-button').click();
  if (type === 'hours') {
    cy.get('#snooze-hours').click();
    cy.get('#snooze-hours-input').clear().type(option);
  } else if (type === 'tomorrow') {
    cy.get('#snooze-tomorrow').click();
    cy.get('#snooze-tomorrow-datepicker').click();
    cy.get('.react-datepicker__time-list-item').contains(option).click();
  }
  cy.get('#snooze-custom-button').click();
};

export const merge = (targetIncidentIdx) => {
  cy.get('#incident-action-merge-button').click();
  cy.get('#merge-select').click();
  cy.get(`[id*="-option-${targetIncidentIdx}"]`).click();
  cy.get('#merge-button').click();
};

export const updatePriority = (priorityName) => {
  cy.get('#incident-action-update-priority-button').click();
  cy.get('.dropdown-item').contains(priorityName).click();
};

export const addNote = (note) => {
  cy.get('#incident-action-add-note-button').click();
  cy.get('#add-note-textarea').type(note);
  cy.get('#add-note-button').click();
};

const toggleRunAction = () => {
  cy.wait(2000); // Unsure why we can't find DOM of action without wait
  cy.get('#incident-action-run-action-button').click();
};

export const runAction = (actionName) => {
  toggleRunAction();
  cy.get('.dropdown-item').contains(actionName).click();
};

export const runExternalSystemSync = (externalSystemName) => {
  toggleRunAction();
  cy.get('.dropdown-item')
    .contains(externalSystemName)
    .then(($el) => {
      const cls = $el.attr('class');
      if (!cls.includes('disabled')) {
        cy.wrap($el).click();
        checkActionAlertsModalContent(`Synced with "${externalSystemName}" on incident(s)`);
      } else {
        expect($el).to.contain('Synced with');
      }
    });
};

export const runResponsePlay = (responsePlayName) => {
  toggleRunAction();
  cy.get('#response-play-select').click();
  cy.contains('div', responsePlayName).click();
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
