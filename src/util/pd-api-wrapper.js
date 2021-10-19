/* eslint-disable import/prefer-default-export */
import PDOAuth from 'util/pdoauth';
import { api } from '@pagerduty/pdjs';
import axios from 'axios';
import Bottleneck from 'bottleneck';

import { PD_OAUTH_CLIENT_ID } from 'util/constants';

// TODO: Figure out how to get this from redux store via sessionStorage
export const getPdAccessToken = () => {
  const token = sessionStorage.getItem('pd_access_token');
  if (!token) {
    PDOAuth.login(PD_OAUTH_CLIENT_ID);
  }
  return token;
};

export const pd = api({ token: getPdAccessToken(), tokenType: 'bearer' });

/*
  Export Throttled Version of Axios Requests
*/

export const pdAxiosRequest = async (method, endpoint, params = {}, data = {}) => axios({
  method,
  url: `https://api.pagerduty.com/${endpoint}`,
  headers: {
    Authorization: `Bearer ${getPdAccessToken()}`,
    Accept: 'application/vnd.pagerduty+json;version=2',
    'content-type': 'application/json; charset=utf-8',
  },
  params,
  data,
});

// Ref: https://www.npmjs.com/package/bottleneck#refresh-interval
const limiter = new Bottleneck({
  reservoir: 1800, // initial value
  reservoirRefreshAmount: 1800,
  reservoirRefreshInterval: 60 * 1000, // must be divisible by 250

  // also use maxConcurrent and/or minTime for safety
  maxConcurrent: 60,
  minTime: 80, // pick a value that makes sense for your use case
});

export const throttledPdAxiosRequest = limiter.wrap(pdAxiosRequest);
