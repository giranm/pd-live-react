import { all } from "redux-saga/effects";

import { getIncidentsAsync } from "./incidents/sagas";

export default function* rootSaga() {
  yield all([
    getIncidentsAsync()
  ]);
}