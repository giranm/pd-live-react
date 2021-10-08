/* eslint-disable import/prefer-default-export */
import PDOAuth from 'util/pdoauth';
import { api } from '@pagerduty/pdjs';

import { PD_OAUTH_CLIENT_ID } from 'util/constants';

// TODO: Figure out how to get this from redux store via sessionStorage
const getPdAccessToken = () => {
  const token = sessionStorage.getItem('pd_access_token');
  if (!token) {
    PDOAuth.login(PD_OAUTH_CLIENT_ID);
  }
  return token;
};

export const pd = api({ token: getPdAccessToken(), tokenType: 'bearer' });
