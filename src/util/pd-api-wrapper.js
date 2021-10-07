/* eslint-disable import/prefer-default-export */
import PDOAuth from 'util/pdoauth';
import { api } from '@pagerduty/pdjs';

// TODO: Figure out how to get this from redux store via sessionStorage
const getPdAccessToken = () => {
  const token = sessionStorage.getItem('pd_access_token');
  if (!token) {
    PDOAuth.login('b0770bc5-8649-4f60-9b16-1ba9360e2a82');
  }
  return token;
};

export const pd = api({ token: getPdAccessToken(), tokenType: 'bearer' });
