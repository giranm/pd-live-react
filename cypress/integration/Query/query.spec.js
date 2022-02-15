import {
  acceptDisclaimer,
  waitForIncidentTable,
  activateButton,
  deactivateButton,
  checkIncidentCellContent,
  checkIncidentCellIcon,
} from '../../support/util/common';

describe('Query Incidents', () => {
  beforeEach(() => {
    acceptDisclaimer();
    waitForIncidentTable();
  });

  const checkIncidentStatusAcrossRows = (icon) => {
    cy.get('.tbody').then(($tbody) => {
      const visibleIncidentCount = $tbody.find('tr').length;
      for (let incidentIdx = 0; incidentIdx < visibleIncidentCount; incidentIdx++) {
        checkIncidentCellIcon('Status', incidentIdx, icon);
      }
    });
  };

  it('Query for triggered incidents only', () => {
    activateButton('query-status-triggered-button');
    deactivateButton('query-status-acknowledged-button');
    deactivateButton('query-status-resolved-button');
    waitForIncidentTable();
    checkIncidentStatusAcrossRows('fa-exclamation-triangle');
  });

  it('Query for acknowledged incidents only', () => {
    deactivateButton('query-status-triggered-button');
    activateButton('query-status-acknowledged-button');
    deactivateButton('query-status-resolved-button');
    waitForIncidentTable();
    checkIncidentStatusAcrossRows('fa-shield-alt');
  });

  it('Query for resolved incidents only', () => {
    deactivateButton('query-status-triggered-button');
    deactivateButton('query-status-acknowledged-button');
    activateButton('query-status-resolved-button');
    waitForIncidentTable();
    checkIncidentStatusAcrossRows('fa-check-circle');
  });
});
