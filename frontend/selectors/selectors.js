export const DEFAULT_PHOTO_URL = '/images/profile/default.png';

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

export const workspaceTitle = (address) => {
  let words = address.split('-');
  for (let i = 0; i < words.length; i++)
    words[i] = words[i].slice(0, 1).toUpperCase() + words[i].slice(1)
  return words.join(' ');
}

// Returns default photo if user is non-existant or doesn't have profile photo
export const photoUrl = (user) => {
  if (!user || !user.photo_url)
    return DEFAULT_PHOTO_URL;
  return user.photo_url;
}

export const getUserName = (user) => {
    if (user.display_name)
      return user.display_name;
    else if (user.full_name)
      return user.full_name;
    else
      return user.email;
}