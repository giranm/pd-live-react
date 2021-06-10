import { all } from "redux-saga/effects";

import { getIncidentsAsync } from "./incidents/sagas";
import { getLogEntriesAsync, updateRecentLogEntriesAsync } from "./log_entries/sagas";

export default function* rootSaga() {
  yield all([
    getIncidentsAsync(),
    getLogEntriesAsync(),
    updateRecentLogEntriesAsync()
  ]);
}