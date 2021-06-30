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

// Prototype function to get object value from JSON path
Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}