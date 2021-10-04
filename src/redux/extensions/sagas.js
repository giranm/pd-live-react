/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest,
} from 'redux-saga/effects';
import { api } from '@pagerduty/pdjs';

import { selectServices } from 'redux/services/selectors';
import { CUSTOM_INCIDENT_ACTION, EXTERNAL_SYSTEM } from 'util/extensions';
import {
  FETCH_EXTENSIONS_REQUESTED,
  FETCH_EXTENSIONS_COMPLETED,
  FETCH_EXTENSIONS_ERROR,
  MAP_SERVICES_TO_EXTENSIONS_REQUESTED,
  MAP_SERVICES_TO_EXTENSIONS_COMPLETED,
  MAP_SERVICES_TO_EXTENSIONS_ERROR,
} from './actions';

import { selectExtensions } from './selectors';

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

export function* getExtensionsAsync() {
  yield takeLatest(FETCH_EXTENSIONS_REQUESTED, getExtensions);
}

export function* getExtensions() {
  try {
    //  Create params and call pd lib
    const response = yield call(pd.all, 'extensions');

    yield put({
      type: FETCH_EXTENSIONS_COMPLETED,
      extensions: response.resource,
    });

    // Perform mapping of services to extensions
    yield put({ type: MAP_SERVICES_TO_EXTENSIONS_REQUESTED });
  } catch (e) {
    yield put({ type: FETCH_EXTENSIONS_ERROR, message: e.message });
  }
}

export function* mapServicesToExtensions() {
  yield takeLatest(MAP_SERVICES_TO_EXTENSIONS_REQUESTED, mapServicesToExtensionsImpl);
}

export function* mapServicesToExtensionsImpl() {
  try {
    const { services } = yield select(selectServices);
    const { extensions } = yield select(selectExtensions);

    // Build map of service ids against extensions
    const serviceExtensionMap = {};
    services.map((service) => {
      const serviceExtensions = [];
      extensions.map((extension) => {
        extension.extension_objects.map((extensionObject) => {
          if (extensionObject.type === 'service_reference' && extensionObject.id === service.id) {
            // Add modified version of extension object for rendering, containing "types" + "labels"
            const modifiedExtension = { ...extension };
            const extensionSummary = modifiedExtension.extension_schema.summary;

            // Custom Incident Action
            if (extensionSummary === CUSTOM_INCIDENT_ACTION) {
              modifiedExtension.extension_type = CUSTOM_INCIDENT_ACTION;

              // ServiceNow
            } else if (
              extensionSummary.includes('ServiceNow') &&
              modifiedExtension.config.sync_options === 'manual_sync'
            ) {
              modifiedExtension.extension_type = EXTERNAL_SYSTEM;
              modifiedExtension.extension_label = 'Sync with ServiceNow';

              // Jira
            } else if (
              extensionSummary.includes('Jira') &&
              !modifiedExtension.config.jira.createIssueOnIncidentTrigger
            ) {
              modifiedExtension.extension_type = EXTERNAL_SYSTEM;
              modifiedExtension.extension_label = `Sync with ${extensionSummary}`;

              // Zendesk
            } else if (extensionSummary === 'Zendesk') {
              modifiedExtension.extension_type = EXTERNAL_SYSTEM;
              modifiedExtension.extension_label = 'Sync with Zendesk';
            }

            serviceExtensions.push(modifiedExtension);
          }
        });
      });
      // Sort name of extensions alphabetically
      serviceExtensions.sort((a, b) => a.name.localeCompare(b.name));
      serviceExtensionMap[service.id] = serviceExtensions;
    });

    yield put({
      type: MAP_SERVICES_TO_EXTENSIONS_COMPLETED,
      serviceExtensionMap,
    });
  } catch (e) {
    yield put({ type: MAP_SERVICES_TO_EXTENSIONS_ERROR, message: e.message });
  }
}
