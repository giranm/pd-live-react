import produce from 'immer';

import {
  UPDATE_CONNECTION_STATUS_REQUESTED,
  UPDATE_CONNECTION_STATUS_COMPLETED,
} from './actions';

const connection = produce(
  (draft, action) => {
    switch (action.type) {
      case UPDATE_CONNECTION_STATUS_REQUESTED:
        draft.status = UPDATE_CONNECTION_STATUS_REQUESTED;
        break;

      case UPDATE_CONNECTION_STATUS_COMPLETED:
        draft.status = UPDATE_CONNECTION_STATUS_COMPLETED;
        draft.connectionStatus = action.connectionStatus;
        draft.connectionStatusMessage = action.connectionStatusMessage;
        break;

      default:
        break;
    }
  },
  {
    connectionStatus: 'negative',
    connectionStatusMessage: 'Not Connected',
    status: '',
  },
);

export default connection;
