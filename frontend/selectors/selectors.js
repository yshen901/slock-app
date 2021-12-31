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

// Returns whether a user should show up in search based on its getUserName
export const userInSearch = (user, searchParam) => {
  let name = getUserName(user).toUpperCase();
  return name.includes(searchParam.toUpperCase());
}

// Takes in channel and users, return array of users
export const channelUsers = (channel, users) => {
  if (!channel || !users) return [];
  return Object.keys(channel.users).map((id, idx) => users[id]);
}

// Takes in channel and users object, returns array of sorted users
export const sortedChannelUsers = (channel, users) => {
  let channel_users = channelUsers(channel, users);
  channel_users.sort(
    (first, second) => {
      return getUserName(first) > getUserName(second) ? 1 : -1;
    }
  );
  return channel_users;
}

// Takes in users object, returns an array of sorted users
export const sortedUsers = (users) => {
  let sortedUsers = Object.values(users);
  sortedUsers.sort(
    (first, second) => {
      return getUserName(first) > getUserName(second) ? 1 : -1;
    }
  );
  return sortedUsers;
}

// Selects a dm channels' user
export const dmChannelUserId = (dmChannel, currentUserId) => {
  let channel_users = Object.keys(dmChannel.users);
  return channel_users[0] == currentUserId ? channel_users[1] : channel_users[0];
}