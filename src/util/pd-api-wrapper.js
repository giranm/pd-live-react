/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
import PDOAuth from 'util/pdoauth';
import { api } from '@pagerduty/pdjs';
import axios from 'axios';
import Bottleneck from 'bottleneck';

import { PD_OAUTH_CLIENT_ID } from 'config/constants';
import { compareCreatedAt } from 'util/helpers';

/*
  PDJS Wrapper
*/
export const getPdAccessToken = () => {
  const token = sessionStorage.getItem('pd_access_token');
  if (!token) {
    PDOAuth.login(PD_OAUTH_CLIENT_ID);
  }
  return token;
};

export const pd = api({ token: getPdAccessToken(), tokenType: 'bearer' });

/*
  Throttled version of Axios requests for direct API calls
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

/*
  Optimized parallel fetch for paginated endpoints
*/

const endpointIdentifier = (endpoint) => {
  if (endpoint.match(/users\/P.*\/sessions/)) {
    return 'user_sessions';
  }
  return endpoint.split('/').pop();
};

export const pdParallelFetch = async (endpoint, params, progressCallback) => {
  let requestParams = {
    limit: 100,
    total: true,
    offset: 0,
  };

  if (params) requestParams = { ...requestParams, ...params };

  let reversedSortOrder = false;
  if (endpoint.indexOf('log_entries') > -1) reversedSortOrder = true;

  const firstPage = (await pdAxiosRequest('GET', endpoint, requestParams)).data;
  let fetchedData = [...firstPage[endpointIdentifier(endpoint)]];
  requestParams.offset += requestParams.limit;

  const promises = [];
  let outerOffset = 0;
  let more = true;
  while (more && outerOffset + requestParams.offset < firstPage.total) {
    while (more
      && (outerOffset + requestParams.offset < firstPage.total) && (requestParams.offset < 10000)) {
      const promise = pdAxiosRequest('GET', endpoint, requestParams)
        .then(({ data }) => {
          fetchedData = [...fetchedData, ...data[endpointIdentifier(endpoint)]];
          if (data.more === false) {
            more = false;
          }
          if (progressCallback) {
            progressCallback(firstPage.total, fetchedData.length);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      promises.push(promise);
      requestParams.offset += requestParams.limit;
    }
    await Promise.all(promises);
    fetchedData.sort(
      (a, b) => (reversedSortOrder ? compareCreatedAt(b, a) : compareCreatedAt(a, b)),
    );
    requestParams[reversedSortOrder ? 'until' : 'since']
      = fetchedData[fetchedData.length - 1].created_at;
    outerOffset = fetchedData.length;
    requestParams.offset = 0;
  }
  fetchedData.sort(
    (a, b) => (reversedSortOrder ? compareCreatedAt(b, a) : compareCreatedAt(a, b)),
  );
  return fetchedData;
};
