/* eslint-disable no-param-reassign */
/* eslint-disable no-sequences */
/* eslint-disable no-return-assign */
import moment from 'moment';

export const pushToArray = (arr, obj, key) => {
  const index = arr.findIndex((e) => e[key] === obj[key]);
  if (index === -1) {
    arr.push(obj);
  } else {
    arr[index] = obj;
  }
};

// Get objects from an array based on another array of key/value while preserving order
export const getObjectsFromList = (searchableList, matchList, matchKey) => {
  const results = searchableList.filter((obj) => matchList.includes(obj[matchKey]));
  return results.sort((a, b) => matchList.indexOf(a[matchKey]) - matchList.indexOf(b[matchKey]));
};

// Get objects from array given matching key/value while preserving order
export const getObjectsFromListbyKey = (searchableList, searchKey, searchValue) => {
  const results = searchableList.filter((obj) => obj[searchKey] === searchValue);
  return results;
};

// Prototype function to get object value from JSON path
Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, ''); // strip a leading dot
  const a = s.split('.');
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};

// Convert list of objects to singular object traversed by "id"
export const convertListToMapById = (list) => list.reduce(
  (obj, item) => (obj[item.id] = item, obj), {},
);
// Get Browser Locale
export const getLanguage = () => navigator.userLanguage
  || (navigator.languages
  && navigator.languages.length
  && navigator.languages[0])
  || navigator.language
  || navigator.browserLanguage
  || navigator.systemLanguage
  || 'en';

// Generate initials from full name
export const getInitials = (fullName) => {
  const allNames = fullName.trim().split(' ');
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, '');
  return initials;
};

// Compare created at date objects
export const compareCreatedAt = (a, b) => moment(a.created_at).diff(moment(b.created_at));
