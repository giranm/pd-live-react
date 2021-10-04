import produce from 'immer';

import {
  GET_USERS_REQUESTED,
  GET_USERS_COMPLETED,
  GET_USERS_ERROR,
  GET_CURRENT_USER_REQUESTED,
  GET_CURRENT_USER_COMPLETED,
  GET_CURRENT_USER_ERROR,
} from './actions';

const users = produce(
  (draft, action) => {
    switch (action.type) {
      case GET_USERS_REQUESTED:
        draft.status = GET_USERS_REQUESTED;
        break;

      case GET_USERS_COMPLETED:
        draft.users = action.users;
        draft.status = GET_USERS_COMPLETED;
        break;

      case GET_USERS_ERROR:
        draft.status = GET_USERS_ERROR;
        draft.error = action.message;
        break;

      case GET_CURRENT_USER_REQUESTED:
        draft.status = GET_CURRENT_USER_REQUESTED;
        break;

      case GET_CURRENT_USER_COMPLETED:
        draft.currentUser = action.currentUser;
        draft.status = GET_CURRENT_USER_COMPLETED;
        break;

      case GET_CURRENT_USER_ERROR:
        draft.status = GET_CURRENT_USER_ERROR;
        draft.error = action.message;
        break;

      default:
        break;
    }
  },
  {
    users: [],
    currentUser: null,
    status: null,
    fetchingData: false,
    error: null,
  },
);

export default users;
