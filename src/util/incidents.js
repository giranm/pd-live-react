/* eslint-disable array-callback-return */
export const TRIGGERED = 'triggered';
export const ESCALATED = 'escalated';
export const ACKNOWLEDGED = 'acknowledged';
export const RESOLVED = 'resolved';
export const SNOOZED = 'snoozed';

export const HIGH = 'high';
export const LOW = 'low';

export const SNOOZE_TIMES = {
  '5 mins': 60 * 5,
  '30 mins': 60 * 30,
  '1 hr': 60 * 60,
  '4 hrs': 60 * 60 * 4,
  '24 hrs': 60 * 60 * 24,
};

// Helper function to filter incidents by json path + possible values
export const filterIncidentsByField = (incidents, jsonPath, possibleValues) => incidents.filter(
  (incident) => {
    const targetValue = Object.byString(incident, jsonPath);
    if (possibleValues.includes(targetValue)) return incident;
  },
);

// Helper function to filter incidents by json path with multiple entries + possible values
// NB - this is used to flatten teams, assignments, and acknowledgment lists
export const filterIncidentsByFieldOfList = (
  incidents,
  jsonPathOuter,
  jsonPathInner,
  possibleValues,
) => incidents.filter((incident) => {
  const incidentInnerFieldObjects = Object.byString(incident, jsonPathOuter);
  const incidentInnerFieldsFlattened = incidentInnerFieldObjects.map(
    (outerObject) => Object.byString(outerObject, jsonPathInner),
  );
  if (possibleValues.some((value) => incidentInnerFieldsFlattened.includes(value))) return incident;
});

// Helper function to generate modal message based on action
export const generateIncidentActionModal = (incidents, action) => {
  // Split incidents based on status
  const unresolvedIncidents = filterIncidentsByField(incidents, 'status', [
    TRIGGERED,
    ACKNOWLEDGED,
  ]);
  const resolvedIncidents = filterIncidentsByField(incidents, 'status', [RESOLVED]);

  // Create message based on action and incident status
  let message;
  const primaryMessage = `Incident(s) ${unresolvedIncidents
    .map((i) => i.incident_number)
    .join(', ')} have been ${action}.`;
  const secondaryMessage = `(${resolvedIncidents.length} Incidents were not ${action} 
    because they have already been suppressed or resolved)`;

  if (unresolvedIncidents.length > 0 && resolvedIncidents.length === 0) {
    message = primaryMessage;
  } else if (unresolvedIncidents.length > 0 && resolvedIncidents.length > 0) {
    message = `${primaryMessage} ${secondaryMessage}`;
  }

  return {
    actionAlertsModalType: 'success',
    actionAlertsModalMessage: message,
  };
};
