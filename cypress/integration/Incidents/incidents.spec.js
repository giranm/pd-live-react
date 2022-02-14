import {
  acceptDisclaimer,
  waitForIncidentTable,
  selectIncident,
  escalate,
  reassign,
  addResponders,
  snooze,
  snoozeCustom,
  merge,
  addNote,
  checkActionAlertsModalContent,
  checkIncidentCellContent,
  deactivateButtonIfActive,
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

  it('Escalate singular incident to multiple levels', () => {
    // Ensure that only high urgency incidents are visible
    deactivateButtonIfActive('query-urgency-low-button');
    waitForIncidentTable();

    // Assumed environment has 3 levels on escalation policy
    for (let escalationLevel = 1; escalationLevel < 4; escalationLevel++) {
      selectIncident(0);
      escalate(escalationLevel);
      checkActionAlertsModalContent(`have been manually escalated to level ${escalationLevel}`);
    }
  });

  it('Reassign singular incident to User A1', () => {
    const assignment = 'User A1';
    selectIncident(0);
    reassign(assignment);
    checkActionAlertsModalContent(`have been reassigned to ${assignment}`);
  });

  it('Reassign singular incident to Team A', () => {
    const assignment = 'Team A';
    selectIncident(1);
    reassign(assignment);
    checkActionAlertsModalContent(`have been reassigned to ${assignment}`);
  });

  it('Add responder (User A1) to singular incident', () => {
    const responders = ['User A1'];
    const message = 'Need help with this incident';
    selectIncident(0);
    addResponders(responders, message);
    checkActionAlertsModalContent('Requested additional response for incident(s)');
  });

  it('Add responder (Team A) to singular incident', () => {
    const responders = ['Team A (EP)'];
    const message = 'Need help with this incident';
    selectIncident(0);
    addResponders(responders, message);
    checkActionAlertsModalContent('Requested additional response for incident(s)');
  });

  it('Add multiple responders (Team A + Team B) to singular incident', () => {
    const responders = ['Team A (EP)', 'Team B (EP)'];
    const message = "Need everyone's help with this incident";
    selectIncident(0);
    addResponders(responders, message);
    checkActionAlertsModalContent('Requested additional response for incident(s)');
  });

  it('Snooze singular incident for specified duration (5 mins)', () => {
    const duration = '5 mins';
    selectIncident(0);
    snooze(duration);
    checkActionAlertsModalContent('have been snoozed.');
  });

  it('Snooze singular incident for custom duration (2 hours)', () => {
    const type = 'hours';
    const option = 2;
    selectIncident(0);
    snoozeCustom(type, option);
    checkActionAlertsModalContent('have been snoozed.');
  });

  it('Snooze singular incident for custom duration (tomorrow for 9:00 AM)', () => {
    const type = 'tomorrow';
    const option = '9:00 AM';
    selectIncident(0);
    snoozeCustom(type, option);
    checkActionAlertsModalContent('have been snoozed.');
  });

  it('Merge two incidents together', () => {
    const targetIncidentIdx = 0;
    selectIncident(targetIncidentIdx);
    selectIncident(targetIncidentIdx + 1);
    merge(targetIncidentIdx);
    checkActionAlertsModalContent('and their alerts have been merged onto');
  });

  it('Resolve singular incident', () => {
    selectIncident(0);
    cy.get('#incident-action-resolve-button').click();
    checkActionAlertsModalContent('have been resolved');
  });
});
