import moment from 'moment';

import {
  acceptDisclaimer,
  waitForIncidentTable,
  activateButton,
  deactivateButton,
  checkIncidentCellContentAllRows,
  checkIncidentCellIconAllRows,
  manageIncidentTableColumns,
} from '../../support/util/common';

describe('Query Incidents', { failFast: { enabled: false } }, () => {
  beforeEach(() => {
    acceptDisclaimer();
    waitForIncidentTable();
  });

  it('Query for incidents within T-2 since date', () => {
    // Limit dataset to resolved incidents on Service A1 that contain text "ab"
    activateButton('query-status-resolved-button');
    cy.get('#query-service-select').click();
    cy.contains('div', 'Service A1').click();
    cy.get('#global-search-input').type('ab');

    // // Update since date to T-2
    const queryDate = moment()
      .subtract(2, 'days')
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
          expect(moment($el.text(), 'DD-MMM \\at h:mm:ss A').diff(queryDate)).to.be.greaterThan(0);
        });
      }
    });
  });

  it('Query for triggered incidents only', () => {
    activateButton('query-status-triggered-button');
    deactivateButton('query-status-acknowledged-button');
    deactivateButton('query-status-resolved-button');
    waitForIncidentTable();
    checkIncidentCellIconAllRows('Status', 'fa-exclamation-triangle');
  });

  it('Query for acknowledged incidents only', () => {
    deactivateButton('query-status-triggered-button');
    activateButton('query-status-acknowledged-button');
    deactivateButton('query-status-resolved-button');
    waitForIncidentTable();
    checkIncidentCellIconAllRows('Status', 'fa-shield-alt');
  });

  it('Query for resolved incidents only', () => {
    deactivateButton('query-status-triggered-button');
    deactivateButton('query-status-acknowledged-button');
    activateButton('query-status-resolved-button');
    waitForIncidentTable();
    checkIncidentCellIconAllRows('Status', 'fa-check-circle');
  });

  it('Query for high urgency incidents only', () => {
    activateButton('query-urgency-high-button');
    deactivateButton('query-urgency-low-button');
    waitForIncidentTable();
    manageIncidentTableColumns('add', ['Urgency']);
    checkIncidentCellContentAllRows('Urgency', ' High');
  });

  it('Query for low urgency incidents only', () => {
    deactivateButton('query-urgency-high-button');
    activateButton('query-urgency-low-button');
    waitForIncidentTable();
    manageIncidentTableColumns('add', ['Urgency']);
    checkIncidentCellContentAllRows('Urgency', ' Low');
  });

  const priorities = ['P1', 'P2', 'P3', 'P4', 'P5', '--'];
  priorities.forEach((currentPriority) => {
    it(`Query for priority "${currentPriority}" incidents only`, () => {
      activateButton(`query-priority-${currentPriority}-button`);
      const excludedPriorities = priorities.filter((priority) => currentPriority !== priority);
      excludedPriorities.forEach((excludedPriority) => {
        deactivateButton(`query-priority-${excludedPriority}-button`);
      });
      waitForIncidentTable();
      checkIncidentCellContentAllRows('Priority', currentPriority);
    });
  });

  const teams = ['Team A', 'Team B', 'Team C'];
  teams.forEach((team) => {
    it(`Query for incidents on ${team} only`, () => {
      cy.get('#query-team-select').click();
      cy.contains('div', team).click();
      waitForIncidentTable();
      manageIncidentTableColumns('add', ['Teams']);
      checkIncidentCellContentAllRows('Teams', team);
    });
  });

  const services = ['Service A1', 'Service B2', 'Service C3'];
  services.forEach((service) => {
    it(`Query for incidents on ${service} only`, () => {
      cy.get('#query-service-select').click();
      cy.contains('div', service).click();
      waitForIncidentTable();
      checkIncidentCellContentAllRows('Service', service);
    });
  });

  it('Query for incidents on Team A and Service A1 only', () => {
    cy.get('#query-team-select').click();
    cy.contains('div', 'Team A').click();
    cy.get('#query-service-select').click();
    cy.contains('div', 'Service A1').click();
    manageIncidentTableColumns('add', ['Teams']);
    checkIncidentCellContentAllRows('Service', 'Service A1');
    checkIncidentCellContentAllRows('Teams', 'Team A');
  });

  it('Query on Team A only allows further querying for associated services', () => {
    cy.get('#query-team-select').click();
    cy.contains('div', 'Team A').click();
    waitForIncidentTable();

    cy.get('#query-service-select').click();
    cy.get('body').then((body) => {
      ['Service A1', 'Service A2'].forEach((service) => {
        expect(body.find(`[class*="-option"]:contains("${service}")`).length).to.equal(1);
      });
    });
  });
});
