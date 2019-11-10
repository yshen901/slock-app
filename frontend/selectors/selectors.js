export const objectToArray = (object) => {
  return Object.keys(object).map((key) => {
    return object[key];
  })
}

export const objectToNameArray = (object) => {
  return Object.values(object).map((value) => {
    return value["name"].toLowerCase();
  })
}

export const arrayToObject = (array) => {
  let object = {};
  for (let i = 0; i < array.length; i++) {
    object[array[i].id] = array[i];
  }
  return object;
}
