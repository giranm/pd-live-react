import {
  faker,
} from '@faker-js/faker';

import {
  HIGH, INCIDENT_STATES,
} from 'util/incidents';

const generateMockIncident = () => {
  // Generate Faker stubs for incident (slimmed down)
  const incidentNumber = Number(faker.random.numeric(5));
  const title = faker.random.words(20);
  const status = INCIDENT_STATES[Math.floor(Math.random() * INCIDENT_STATES.length)];
  const incidentKey = faker.random.alphaNumeric(32);
  const incidentId = faker.random.alphaNumeric(14);
  const createdAt = faker.date
    .between('2020-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z')
    .toISOString();
  return {
    incident_number: incidentNumber,
    title,
    description: title,
    created_at: createdAt,
    status,
    incident_key: incidentKey,
    urgency: HIGH,
    id: incidentId,
    type: 'incident',
    summary: title,
  };
};

export const generateMockIncidents = (numIncidents) => Array.from(
  { length: numIncidents }, () => generateMockIncident(),
);

export default generateMockIncidents;

test.skip('Mock incidents', () => 1);
