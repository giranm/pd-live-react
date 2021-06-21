export const pushToArray = (arr, obj, key) => {
  const index = arr.findIndex((e) => e[key] === obj[key]);
  if (index === -1) {
    arr.push(obj);
  } else {
    arr[index] = obj;
  }
}