/* eslint-disable array-callback-return */
import { put, call, select, takeLatest } from "redux-saga/effects";
import { api } from '@pagerduty/pdjs';

import {
  FETCH_EXTENSIONS_REQUESTED,
  FETCH_EXTENSIONS_COMPLETED,
  FETCH_EXTENSIONS_ERROR,
  MAP_SERVICES_TO_EXTENSIONS_REQUESTED,
  MAP_SERVICES_TO_EXTENSIONS_COMPLETED,
  MAP_SERVICES_TO_EXTENSIONS_ERROR,
} from "./actions";

import { selectExtensions } from "./selectors";
import { selectServices } from "redux/services/selectors"

// TODO: Update with Bearer token OAuth
const pd = api({ token: process.env.REACT_APP_PD_TOKEN });

export function* getExtensionsAsync() {
  yield takeLatest(FETCH_EXTENSIONS_REQUESTED, getExtensions);
};

export function* getExtensions() {
  try {
    //  Create params and call pd lib
    let response = yield call(pd.all, "extensions");

    yield put({
      type: FETCH_EXTENSIONS_COMPLETED,
      extensions: response.resource
    });

    // Perform mapping of services to extensions
    yield put({ type: MAP_SERVICES_TO_EXTENSIONS_REQUESTED });

  } catch (e) {
    yield put({ type: FETCH_EXTENSIONS_ERROR, message: e.message });
  }
};

export function* mapServicesToExtensions() {
  yield takeLatest(MAP_SERVICES_TO_EXTENSIONS_REQUESTED, mapServicesToExtensionsImpl);
};

export function* mapServicesToExtensionsImpl() {
  try {
    let { services } = yield select(selectServices);
    let { extensions } = yield select(selectExtensions);

    // Build map of service ids against extensions
    let serviceExtensionMap = {};
    services.map(service => {
      let serviceExtensions = [];
      extensions.map(extension => {
        extension.extension_objects.map(extensionObject => {
          if (extensionObject.type === "service_reference" && extensionObject.id === service.id) {
            // Add modified version of extension object for rendering, containing "types" + "labels"
            let modifiedExtension = { ...extension };
            let extensionSummary = modifiedExtension.extension_schema.summary;

            // Custom Incident Action
            if (extensionSummary === "Custom Incident Action") {
              modifiedExtension["extension_type"] = "Custom Incident Action";

              // ServiceNow
            } else if (extensionSummary.includes("ServiceNow") && modifiedExtension.config.sync_options === "manual_sync") {
              modifiedExtension["extension_type"] = "Ticketing";
              modifiedExtension["extension_label"] = "Sync with ServiceNow";

              // Jira
            } else if (extensionSummary.includes("Jira") && !modifiedExtension.config.jira.createIssueOnIncidentTrigger) {
              modifiedExtension["extension_type"] = "Ticketing"
              modifiedExtension["extension_label"] = `Sync with ${extensionSummary}`;

              // Zendesk
            } else if (extensionSummary === "Zendesk") {
              modifiedExtension["extension_type"] = "Ticketing";
              modifiedExtension["extension_label"] = "Sync with Zendesk";
            }

            serviceExtensions.push(modifiedExtension);
          }
        })
      });
      // Sort name of extensions alphabetically
      serviceExtensions.sort(
        (a, b) => a["name"].localeCompare(b["name"])
      );
      serviceExtensionMap[service.id] = serviceExtensions;
    });

    yield put({ type: MAP_SERVICES_TO_EXTENSIONS_COMPLETED, serviceExtensionMap });

  } catch (e) {
    yield put({ type: MAP_SERVICES_TO_EXTENSIONS_ERROR, message: e.message });
  }
};