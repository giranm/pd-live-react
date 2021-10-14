/* eslint-disable import/prefer-default-export */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
/* eslint-disable no-loop-func */
import moment from 'moment';

import { getPdAccessToken } from 'util/pd-api-wrapper';

function endpointIdentifier(endpoint) {
  if (endpoint.match(/users\/P.*\/sessions/)) {
    return 'user_sessions';
  }
  return endpoint.split('/').pop();
}

async function pdRequest(token, endpoint, method, params, data) {
  let url = `https://api.pagerduty.com/${endpoint}`;
  if (params) {
    url += `?${new URLSearchParams(params)}`;
  }
  let body = null;
  if (data) {
    body = JSON.stringify(data);
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.pagerduty+json;version=2',
    },
    body,
  });
  if (!response.ok) {
    console.log('Invalid Response', response);
  }
  const responseData = await response.json();
  return responseData;
}

export const pdFetch = async (endpoint, params, progressCallback) => {
  const token = getPdAccessToken();

  let requestParams = {
    limit: 100,
    total: true,
    offset: 0,
  };
  if (params) {
    requestParams = { ...requestParams, ...params };
  }

  let reversedSortOrder = false;
  if (endpoint.indexOf('log_entries') > -1) {
    reversedSortOrder = true;
  }

  const firstPage = await pdRequest(token, endpoint, 'GET', requestParams);
  console.log(`total is ${firstPage.total}`);
  let fetchedData = [...firstPage[endpointIdentifier(endpoint)]];
  requestParams.offset += requestParams.limit;

  let promises = [];
  let outerOffset = 0;
  let more = true;
  while (more && outerOffset + requestParams.offset < firstPage.total) {
    while (more && (outerOffset + requestParams.offset < firstPage.total) && (requestParams.offset < 10000)) {
      const promise = pdRequest(token, endpoint, 'GET', requestParams)
        .then((page) => {
          fetchedData = [...fetchedData, ...page[endpointIdentifier(endpoint)]];
          if (page.more === false) {
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
      if (promises.length > 10) {
        await Promise.all(promises);
        promises = [];
      }
    }
    await Promise.all(promises);
    fetchedData.sort((a, b) => (reversedSortOrder ? compareCreatedAt(b, a) : compareCreatedAt(a, b)));
    requestParams[reversedSortOrder ? 'until' : 'since'] = fetchedData[fetchedData.length - 1].created_at;
    console.log(`hit 10000 request limit, setting outer offset to ${fetchedData.length} and setting ${reversedSortOrder ? 'until' : 'since'} to ${fetchedData[fetchedData.length - 1].created_at}`);
    outerOffset = fetchedData.length;
    requestParams.offset = 0;
  }
  console.log(`got ${fetchedData.length} ${endpointIdentifier(endpoint)}`);
  fetchedData.sort((a, b) => (reversedSortOrder ? compareCreatedAt(b, a) : compareCreatedAt(a, b)));
  return fetchedData;
};

function compareCreatedAt(a, b) {
  return moment(a.created_at).diff(moment(b.created_at));
}
