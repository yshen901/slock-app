export const DEFAULT_PHOTO_URL = '/images/profile/default.png';
export const UTF_CODE_NAMES = {
  '\u{1F4AF}': "100", 
  '\u{1F44D}': "Sounds good",
  '\u{1F642}': "Smiling",
  '\u{1F602}': "Laughing",
  '\u{1F60D}': "Heart eyes",
  '\u{1F622}': "Crying",
  '\u{1F620}': "Angry",
};

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

// Returns user activity symbol classname
export const getUserActivity = (user, darkGreen=true, darkGray=false) => {
  if (user.logged_in && user.active)
    return `fas fa-circle active-circle${darkGreen ? "-dark" : ""}`;
  return `fas fa-circle inactive-circle ${darkGray ? "gray" : ""}` ;
}

// Returns user paused symbol classname
export const getUserPaused = (user, darkGreen=true, darkGray=false) => {
  if (!user.paused)
    return "user-paused-icon hidden";

  let color = darkGray ? "gray" : "dark-gray";
  if (user.logged_in && user.active)
    color = darkGreen ? "dark-green" : "light-green";
  return `user-paused-icon ${color}`
}

// Returns user's local time based on their time offset
export const getLocalTime = (user) => {
  let date = new Date();
  let hours = date.getUTCHours() + user.timezone_offset;
  let minutes = date.getUTCMinutes();

  return `${hours % 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}`
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

// SELECTS DM_CHANNEL'S OTHER USER
export const dmChannelUserId = (dmChannel, currentUserId) => {
  let channel_users = Object.keys(dmChannel.users);
  return channel_users[0] == currentUserId ? channel_users[1] : channel_users[0];
}

// PROCESS MESSAGE TIMES
export const getMessageTimestamp = (message, seconds=false) => {
  let message_time = new Date(message.created_at);
  if (message_time == "Invalid Date") 
    message_time = message.created_at;
  else
    message_time = message_time.toLocaleTimeString();

  return processTime(message_time, seconds);
}

export const processTime = (timeString, seconds) => {
  let len = timeString.length;
  let status = timeString.slice(len - 2);
  let timeData = timeString.split(" ")[0].split(":");

  let timeDiff = status == "PM" ? 12 : 0;
  
  if (seconds)
    return `${parseInt(timeData[0]) + timeDiff}:${timeData[1]}:${timeData[2]}`
  return `${parseInt(timeData[0]) + timeDiff}:${timeData[1]}`
}

export const getMessageDate = (message, currentDate) => {
  let messageDate = new Date(message.created_at);
  messageDate = messageDate.toLocaleDateString();

  if (messageDate == "Invalid Date")
    return currentDate;
  return messageDate;
}