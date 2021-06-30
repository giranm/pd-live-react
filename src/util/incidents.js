/* eslint-disable array-callback-return */
export const TRIGGERED = 'triggered';
export const ACKNOWLEDGED = 'acknowledged';
export const RESOLVED = 'resolved';

export const HIGH = 'high';
export const LOW = 'low';

// Helper function to filter incidents by json path + possible values
export const filterIncidentsByField = (incidents, jsonPath, possibleValues) => {
  return incidents.filter(
    (incident) => {
      let targetValue = Object.byString(incident, jsonPath);
      if (possibleValues.includes(targetValue))
        return incident;
    }
  );
};

// Helper function to filter incidents by json path with multiple entries + possible values
// NB - this is used to flatten teams, assignments, and acknowledgment lists
export const filterIncidentsByFieldOfList = (incidents, jsonPathOuter, jsonPathInner, possibleValues) => {
  return incidents.filter(
    (incident) => {
      let incidentInnerFieldObjects = Object.byString(incident, jsonPathOuter);
      let incidentInnerFieldsFlattened = incidentInnerFieldObjects.map(
        (outerObject) => Object.byString(outerObject, jsonPathInner)
      );
      if (possibleValues.some(value => incidentInnerFieldsFlattened.includes(value)))
        return incident;
    }
  );
};