import {
  acceptDisclaimer,
  waitForIncidentTable,
  selectIncident,
  addNote,
  checkActionAlertsModalContent,
  checkIncidentCellContent,
} from '../../support/util/common';

describe('Manage Open Incidents', () => {
  // We use beforeEach as each test will reload/clear the session
  beforeEach(() => {
    acceptDisclaimer();
    waitForIncidentTable();
  });

  it('Acknowledge singular incident', () => {
    selectIncident(0);
    cy.get('#incident-action-acknowledge-button').click();
    checkActionAlertsModalContent('have been acknowledged');
  });

  it('Add note to singular incident', () => {
    const note = 'All your base are belong to us';
    const incidentIdx = 0;

    selectIncident(incidentIdx);
    addNote(note);

    checkActionAlertsModalContent('have been updated with a note');
    checkIncidentCellContent('Latest Note', incidentIdx, note);
  });

  it('Add a very long note to singular incident which overflows', () => {
    const note = 'This note is so long that I gave up writing a novel and decided to quit!';
    const incidentIdx = 1;

    selectIncident(incidentIdx);
    addNote(note);

    checkActionAlertsModalContent('have been updated with a note');
    checkIncidentCellContent('Latest Note', incidentIdx, note);
  });
});
