/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */

import {
  api,
} from '@pagerduty/pdjs';
import axios from 'axios';
import Bottleneck from 'bottleneck';

import {
  PD_USER_TOKEN,
} from 'config/constants';
import {
  compareCreatedAt,
} from 'util/helpers';

/*
  PDJS Wrapper
*/
export const getPdAccessTokenObject = () => {
  // Check if user token is loaded from env, else assume OAuth workflow
  let token;
  let tokenType;

  if (PD_USER_TOKEN) {
    sessionStorage.setItem('pd_access_token', token);
    token = PD_USER_TOKEN;
  } else {
    token = sessionStorage.getItem('pd_access_token');
    tokenType = 'bearer';
  }

  // Return object neeed for PD API helpers
  if (tokenType === 'bearer') {
    return {
      token,
      tokenType,
    };
  }
  return {
    token,
  };
};

export const pd = api(getPdAccessTokenObject());

/*
  Throttled version of Axios requests for direct API calls
*/

export const pdAxiosRequest = async (method, endpoint, params = {}, data = {}) => axios({
  method,
  url: `https://api.pagerduty.com/${endpoint}`,
  headers: {
    Authorization: (() => {
      const tokenObj = getPdAccessTokenObject();
      if (tokenObj.tokenType === 'bearer') {
        return `Bearer ${tokenObj.token}`;
      }
      return `Token token=${tokenObj.token}`;
    })(),
    Accept: 'application/vnd.pagerduty+json;version=2',
    'content-type': 'application/json; charset=utf-8',
  },
  params,
  data,
});

// Ref: https://www.npmjs.com/package/bottleneck#refresh-interval
const limiterSettings = {
  reservoir: 200,
  reservoirRefreshAmount: 200,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: 20,
};

// limiter needs to be a mutable export because we need it to get the
// queue stats, and we have to reassign it when we clear the queue

// eslint-disable-next-line import/no-mutable-exports
export let limiter = new Bottleneck(limiterSettings);

// throttledPdAxiosRequest needs to be a mutable export because when we
// reset the limiter, we have to re-wrap pdAxiosRequest

// eslint-disable-next-line import/no-mutable-exports
export let throttledPdAxiosRequest = limiter.wrap(pdAxiosRequest);

// drop all the queued requests in the limiter - needed if we are getting
// the list of incidents again but there are still outstanding requests
// for notes, etc.
export const resetLimiterWithRateLimit = async (limit = 200) => {
  await limiter.stop({ dropWaitingJobs: true });
  limiter = new Bottleneck({
    ...limiterSettings,
    reservoir: limit,
    reservoirRefreshAmount: limit,
  });
  throttledPdAxiosRequest = limiter.wrap(pdAxiosRequest);
};

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
  const fetchedData = firstPage[endpointIdentifier(endpoint)];

  const promises = [];
  if (firstPage.more) {
    for (
      let offset = requestParams.limit;
      offset < firstPage.total;
      offset += requestParams.limit
    ) {
      const promise = throttledPdAxiosRequest('GET', endpoint, { ...requestParams, offset })
        .then(({
          data,
        }) => {
          fetchedData.push(...data[endpointIdentifier(endpoint)]);
          if (progressCallback) {
            progressCallback(firstPage.total, fetchedData.length);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
      promises.push(promise);
    }
  }
  await Promise.all(promises);
  // eslint-disable-next-line max-len
  fetchedData.sort((a, b) => (reversedSortOrder ? compareCreatedAt(b, a) : compareCreatedAt(a, b)));
  return fetchedData;
};
