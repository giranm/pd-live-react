import produce from 'immer';

import {
  USER_AUTHORIZE_REQUESTED,
  USER_AUTHORIZE_COMPLETED,
  USER_AUTHORIZE_ERROR,
  USER_UNAUTHORIZE_REQUESTED,
  USER_UNAUTHORIZE_COMPLETED,
  USER_UNAUTHORIZE_ERROR,
  USER_ACCEPT_DISCLAIMER_REQUESTED,
  USER_ACCEPT_DISCLAIMER_COMPLETED,
  USER_ACCEPT_DISCLAIMER_ERROR,
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
      case USER_AUTHORIZE_REQUESTED:
        draft.status = USER_AUTHORIZE_REQUESTED;
        break;

      case USER_AUTHORIZE_COMPLETED:
        draft.userAuthorized = action.userAuthorized;
        draft.status = USER_AUTHORIZE_COMPLETED;
        break;

      case USER_AUTHORIZE_ERROR:
        draft.status = USER_AUTHORIZE_ERROR;
        draft.error = action.message;
        break;

      case USER_UNAUTHORIZE_REQUESTED:
        draft.status = USER_UNAUTHORIZE_REQUESTED;
        break;

      case USER_UNAUTHORIZE_COMPLETED:
        draft.userAuthorized = action.userAuthorized;
        draft.status = USER_UNAUTHORIZE_COMPLETED;
        break;

      case USER_UNAUTHORIZE_ERROR:
        draft.status = USER_UNAUTHORIZE_ERROR;
        draft.error = action.message;
        break;

      case USER_ACCEPT_DISCLAIMER_REQUESTED:
        draft.status = USER_ACCEPT_DISCLAIMER_REQUESTED;
        break;

      case USER_ACCEPT_DISCLAIMER_COMPLETED:
        draft.userAcceptedDisclaimer = action.userAcceptedDisclaimer;
        draft.status = USER_ACCEPT_DISCLAIMER_COMPLETED;
        break;

      case USER_ACCEPT_DISCLAIMER_ERROR:
        draft.status = USER_ACCEPT_DISCLAIMER_ERROR;
        draft.error = action.message;
        break;

      case GET_USERS_REQUESTED:
        draft.status = GET_USERS_REQUESTED;
        break;

      case GET_USERS_COMPLETED:
        draft.users = action.users;
        draft.usersMap = action.usersMap;
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
    usersMap: {},
    currentUser: null,
    userAuthorized: false,
    userAcceptedDisclaimer: false,
    status: null,
    fetchingData: false,
    error: null,
  },
);

export default users;
