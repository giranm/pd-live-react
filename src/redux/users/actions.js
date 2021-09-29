// Define Action Types
export const GET_USERS_REQUESTED = "GET_USERS_REQUESTED";
export const GET_USERS_COMPLETED = "GET_USERS_COMPLETED";
export const GET_USERS_ERROR = "GET_USERS_ERROR";

export const GET_CURRENT_USER_REQUESTED = "GET_CURRENT_USER_REQUESTED";
export const GET_CURRENT_USER_COMPLETED = "GET_CURRENT_USER_COMPLETED";
export const GET_CURRENT_USER_ERROR = "GET_CURRENT_USER_ERROR";

export const getUsersAsync = () => ({
  type: GET_USERS_REQUESTED,
});

export const getCurrentUserAsync = () => ({
  type: GET_CURRENT_USER_REQUESTED,
});