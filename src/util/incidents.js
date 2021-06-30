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