export const pushToArray = (arr, obj, key) => {
  const index = arr.findIndex((e) => e[key] === obj[key]);
  if (index === -1) {
    arr.push(obj);
  } else {
    arr[index] = obj;
  }
}

// Get objects from an array based on another array of key/value while preserving order
export const getObjectsFromList = (searchableList, matchList, matchKey) => {
  let results = searchableList.filter((obj) => matchList.includes(obj[matchKey]));
  return results.sort((a, b) => matchList.indexOf(a[matchKey]) - matchList.indexOf(b[matchKey]));
}