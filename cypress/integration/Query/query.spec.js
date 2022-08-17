import moment from 'moment';

import gb from 'date-fns/locale/en-GB';
import {
  registerLocale,
} from 'react-datepicker';

import {
  acceptDisclaimer,
  waitForIncidentTable,
  activateButton,
  deactivateButton,
  checkIncidentCellContentAllRows,
  checkIncidentCellIconAllRows,
  manageIncidentTableColumns,
  priorityNames,
  selectIncident,
} from '../../support/util/common';

registerLocale('en-GB', gb);
moment.locale('en-GB');

describe('Query Incidents', { failFast: { enabled: false } }, () => {
  before(() => {
    acceptDisclaimer();
    manageIncidentTableColumns('remove', ['Latest Note']);
    manageIncidentTableColumns('add', ['Urgency', 'Teams']);
    priorityNames.forEach((currentPriority) => {
      activateButton(`query-priority-${currentPriority}-button`);
    });
    waitForIncidentTable();
  });

  beforeEach(() => {
    if (cy.state('test').currentRetry() > 1) {
      acceptDisclaimer();
      manageIncidentTableColumns('remove', ['Latest Note']);
      manageIncidentTableColumns('add', ['Urgency', 'Teams']);
    }
    priorityNames.forEach((currentPriority) => {
      activateButton(`query-priority-${currentPriority}-button`);
    });
  });

  it('Query for incidents within T-1 since date', () => {
    // Limit dataset to resolved low-urgency incidents
    activateButton('query-status-resolved-button');
    deactivateButton('query-urgency-low-button');

    // Update since date to T-1
    const queryDate = moment()
      .subtract(1, 'days')
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    cy.get('#query-date-input').clear().type(queryDate.format('DD/MM/yyyy')).type('{enter}');
    waitForIncidentTable();

    // Iterate through incident table and perform Moment date comparison
    cy.get('.tbody').then(($tbody) => {
      const visibleIncidentCount = $tbody.find('tr').length;
      for (let incidentIdx = 0; incidentIdx < visibleIncidentCount; incidentIdx++) {
        cy.get(
          `[data-incident-header="Created At"][data-incident-row-cell-idx="${incidentIdx}"]`,
        ).then(($el) => {
          expect(moment($el.text(), 'LL \\at h:mm:ss A').diff(queryDate)).to.be.greaterThan(0);
        });
      }
    });

    // Reset query for next test
    activateButton('query-urgency-low-button');
  });

  it('Query for incidents exceeding MAX_INCIDENTS_LIMIT; Cancel Request', () => {
    // Update since date to T-2
    const queryDate = moment()
      .subtract(2, 'days')
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    cy.get('#query-date-input').clear().type(queryDate.format('DD/MM/yyyy')).type('{enter}');

    // Cancel request from modal
    cy.get('#cancel-incident-query-button').click();
    cy.get('div.query-cancelled-ctr')
      .should('be.visible')
      .should('contain.text', 'Query has been cancelled by user');
    cy.get('div.selected-incidents-ctr').should('be.visible').should('contain.text', 'N/A');

    // Reset query for next test
    deactivateButton('query-status-resolved-button');
  });

  it('Query for incidents exceeding MAX_INCIDENTS_LIMIT; Accept Request', () => {
    // Accept request from modal
    activateButton('query-status-resolved-button');
    cy.get('#retrieve-incident-query-button').click();
    cy.get('div.query-active-ctr')
      .should('be.visible')
      .should('contain.text', 'Querying PagerDuty API');
    cy.get('div.selected-incidents-ctr').should('be.visible').should('contain.text', 'Querying');
    waitForIncidentTable();

    // Reset query for next test
    deactivateButton('query-status-resolved-button');
    const queryDate = moment()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    cy.get('#query-date-input').clear().type(queryDate.format('DD/MM/yyyy')).type('{enter}');
    waitForIncidentTable();
  });

  it('Query for triggered incidents only', () => {
    activateButton('query-status-triggered-button');
    deactivateButton('query-status-acknowledged-button');
    deactivateButton('query-status-resolved-button');
    waitForIncidentTable();
    checkIncidentCellIconAllRows('Status', 'fa-triangle-exclamation');
  });

  it('Query for acknowledged incidents only', () => {
    // Ensure at least one incident is acknowledged for test
    selectIncident(0);
    cy.get('#incident-action-acknowledge-button').click();
    cy.get('.action-alerts-modal').type('{esc}');

    deactivateButton('query-status-triggered-button');
    activateButton('query-status-acknowledged-button');
    deactivateButton('query-status-resolved-button');
    waitForIncidentTable();
    checkIncidentCellIconAllRows('Status', 'fa-shield-halved');
  });

  it('Query for resolved incidents only', () => {
    deactivateButton('query-status-triggered-button');
    deactivateButton('query-status-acknowledged-button');
    activateButton('query-status-resolved-button');
    waitForIncidentTable();
    checkIncidentCellIconAllRows('Status', 'fa-circle-check');

    // Reset query for next test
    activateButton('query-status-triggered-button');
    activateButton('query-status-acknowledged-button');
    deactivateButton('query-status-resolved-button');
  });

  it('Query for high urgency incidents only', () => {
    activateButton('query-urgency-high-button');
    deactivateButton('query-urgency-low-button');
    waitForIncidentTable();
    checkIncidentCellContentAllRows('Urgency', ' High');
  });

  it('Query for low urgency incidents only', () => {
    deactivateButton('query-urgency-high-button');
    activateButton('query-urgency-low-button');
    waitForIncidentTable();
    checkIncidentCellContentAllRows('Urgency', ' Low');

    // Reset query for next test
    activateButton('query-urgency-high-button');
  });

  priorityNames.forEach((currentPriority) => {
    it(`Query for priority "${currentPriority}" incidents only`, () => {
      activateButton(`query-priority-${currentPriority}-button`);
      const excludedPriorities = priorityNames.filter((priority) => currentPriority !== priority);
      excludedPriorities.forEach((excludedPriority) => {
        deactivateButton(`query-priority-${excludedPriority}-button`);
      });
      waitForIncidentTable();
      checkIncidentCellContentAllRows('Priority', currentPriority);
    });
  });

  const teams = ['Team A', 'Team B'];
  teams.forEach((team) => {
    it(`Query for incidents on ${team} only`, () => {
      cy.get('#query-team-select').click().type(`${team}{enter}`);
      waitForIncidentTable();
      checkIncidentCellContentAllRows('Teams', team);
      cy.get('#query-team-select').click().type('{del}');
    });
  });

  const services = ['Service A1', 'Service B2'];
  services.forEach((service) => {
    it(`Query for incidents on ${service} only`, () => {
      cy.get('#query-service-select').click().type(`${service}{enter}`);
      waitForIncidentTable();
      checkIncidentCellContentAllRows('Service', service);
      cy.get('#query-service-select').click().type('{del}');
    });
  });

  it('Query for incidents on Team A and Service A1 only', () => {
    cy.get('#query-team-select').click().type('Team A{enter}');
    cy.get('#query-service-select').click().type('Service A1{enter}');

    waitForIncidentTable();
    checkIncidentCellContentAllRows('Service', 'Service A1');
    checkIncidentCellContentAllRows('Teams', 'Team A');

    cy.get('#query-team-select').click().type('{del}');
    cy.get('#query-service-select').click().type('{del}');
  });

  it('Query on Team A only allows further querying for associated services and users', () => {
    cy.get('#query-team-select').click().type('Team A{enter}');
    waitForIncidentTable();

    cy.get('#query-service-select').click();
    cy.get('body').then((body) => {
      ['Service A1', 'Service A2'].forEach((service) => {
        expect(body.find(`[class*="-option"]:contains("${service}")`).length).to.equal(1);
      });
    });

    cy.get('#query-user-select').click();
    cy.get('body').then((body) => {
      ['User A1', 'User A2', 'User A3'].forEach((user) => {
        expect(body.find(`[class*="-option"]:contains("${user}")`).length).to.equal(1);
      });
    });

    cy.get('#query-team-select').click().type('{del}');
  });

  it('Query for incidents assigned to User A1, A2, or A3', () => {
    cy.get('#query-user-select')
      .click()
      .type('User A1{enter}')
      .type('User A2{enter}')
      .type('User A3{enter}');

    waitForIncidentTable();
    checkIncidentCellContentAllRows('Assignees', 'UA');

    cy.get('#query-user-select').click().type('{del}{del}{del}');
  });

  it('Sort incident column "#" by ascending order', () => {
    cy.get('[data-column-name="#"]')
      .click()
      .then(($el) => {
        const cls = $el.attr('class');
        expect(cls).to.equal('th-sorted');
        cy.wrap($el).contains('# ▲');
      });
  });

  it('Sort incident column "#" by descending order', () => {
    cy.get('[data-column-name="#"]')
      .click()
      .then(($el) => {
        const cls = $el.attr('class');
        expect(cls).to.equal('th-sorted');
        cy.wrap($el).contains('# ▼');
      });
  });

  it('Clear sort on incident column "#"', () => {
    cy.get('[data-column-name="#"]')
      .click()
      .then(($el) => {
        const cls = $el.attr('class');
        expect(cls).to.equal('th');
        cy.wrap($el).contains('#');
      });
  });
});
