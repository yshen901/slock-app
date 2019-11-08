export const objectToArray = (object) => {
  return Object.keys(object).map((key, idx) => {
    return object[key];
  })
}

export const arrayToObject = (array) => {
  let object = {};
  for (let i = 0; i < array.length; i++) {
    object[array[i].id] = array[i];
  }
  return object;
}
