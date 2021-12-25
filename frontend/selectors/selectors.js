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

// Returns username based on user data
export const getUserName = (user, fullNameFirst=false) => {
  let [first, second, third] = [user.display_name, user.full_name, user.email];
  if (fullNameFirst)
    [first, second] = [second, first]
  
  if (first) return first;
  if (second) return second;
  if (third) return third;
}