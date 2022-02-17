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

  // TODO: Find out how to see what the remaining services are for team selection
  // it('Query on Team A only shows their services', () => {
  //   cy.get('#query-team-select').click();
  //   cy.contains('div', 'Team A').click();
  //   cy.get('body').then((body) => {
  //     ['Service A1', 'Service A2'].forEach((service) => {
  //       expect(body.find(`[class*="-option" and contains(text(),"${service}")]`).length).to.equal(
  //         0,
  //       );
  //     });
  //   });
  // });
});
