import produce from 'immer';

import {
  UPDATE_CONNECTION_STATUS_REQUESTED,
  UPDATE_CONNECTION_STATUS_COMPLETED,
  CHECK_CONNECTION_STATUS_REQUESTED,
  CHECK_CONNECTION_STATUS_COMPLETED,
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

      case CHECK_CONNECTION_STATUS_REQUESTED:
        draft.status = CHECK_CONNECTION_STATUS_REQUESTED;
        break;

      case CHECK_CONNECTION_STATUS_COMPLETED:
        draft.status = CHECK_CONNECTION_STATUS_COMPLETED;
        break;

      default:
        break;
    }
  },
  {
    connectionStatus: 'dormant',
    connectionStatusMessage: 'Connecting',
    status: '',
  },
);

export default connection;
