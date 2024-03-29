import {
  faker,
} from '@faker-js/faker';

import {
  HIGH, INCIDENT_STATES,
} from 'util/incidents';

const generateMockAlert = () => {
  // Generate Faker stubs for alert
  const title = faker.random.words(20);
  const alertKey = faker.random.alphaNumeric(32);
  const alertId = faker.random.alphaNumeric(14);
  const createdAt = faker.date
    .between('2020-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z')
    .toISOString();
  const severity = faker.helpers.arrayElement(['info', 'warning', 'error', 'critical']);
  const ipv4 = faker.internet.ipv4();
  const jobType = faker.name.jobType();
  const component = faker.random.word();
  const quote = faker.commerce.productDescription();
  const message = faker.commerce.productDescription();
  const uuid = faker.datatype.uuid();
  const link = faker.internet.url();
  return {
    type: 'alert',
    id: alertId,
    alert_key: alertKey,
    summary: title,
    created_at: createdAt,
    body: {
      contexts: [],
      cef_details: {
        contexts: [],
        dedup_key: alertId,
        description: title,
        details: {
          quote,
          'some obsecure field': uuid,
          link,
        },
        event_class: jobType,
        message,
        mutations: [
          {
            action_type: 'priority',
            source: {
              id: 'PABCXYZ/service',
              node_id: null,
              type: 'orchestration',
            },
            type: 'event_rule_engine_action',
            value: 'PABCXYZ',
          },
        ],
        service_group: jobType,
        severity,
        source_component: component,
        source_origin: ipv4,
        version: '1.0',
      },
      type: 'alert_body',
    },
  };
};

export const generateMockAlerts = (num) => Array.from({ length: num }, () => generateMockAlert());

const generateMockNote = () => {
  // Generate Faker stubs for note
  const noteId = faker.random.alphaNumeric(14);
  const content = faker.random.words(20);
  const userName = faker.name.fullName();
  const userId = faker.random.alphaNumeric(7);
  const createdAt = faker.date
    .between('2020-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z')
    .toISOString();
  return {
    id: noteId,
    user: {
      id: userId,
      type: 'user_reference',
      summary: userName,
      self: `https://api.pagerduty.com/users/${userId}`,
      html_url: `https://www.pagerduty.com/users/${userId}`,
    },
    content,
    created_at: createdAt,
    channel: {
      summary: 'The PagerDuty website or APIs',
    },
  };
};

export const generateMockNotes = (num) => Array.from({ length: num }, () => generateMockNote());

const generateMockIncident = () => {
  // Generate Faker stubs for incident (slimmed down)
  const incidentNumber = Number(faker.random.numeric(5));
  const title = faker.random.words(20);
  const status = INCIDENT_STATES[Math.floor(Math.random() * INCIDENT_STATES.length)];
  const incidentKey = faker.random.alphaNumeric(32);
  const incidentId = faker.random.alphaNumeric(14);
  const escalationPolicyId = faker.random.alphaNumeric(7);
  const serviceId = faker.random.alphaNumeric(7);
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
    escalation_policy: {
      id: escalationPolicyId,
    },
    service: {
      id: serviceId,
    },
    alerts: generateMockAlerts(5),
    notes: generateMockNotes(5),
  };
};

// eslint-disable-next-line max-len
export const generateMockIncidents = (num) => Array.from({ length: num }, () => generateMockIncident());

export default generateMockIncidents;

test.skip('Mock incidents', () => 1);
