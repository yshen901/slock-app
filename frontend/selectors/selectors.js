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
export const DEFAULT_USER_PHOTO_URLS = {
  "1": "/images/lotr/boromir.jpg",
  "2": "/images/lotr/gandalf.png",
  "3": "/images/lotr/legolas.jpg",
  "4": "/images/lotr/gimli.png",
  "5": "/images/lotr/frodo.jpg",
  "6": "/images/lotr/aragorn.jpg",
  "8": "/images/lotr/yuci.jpg",
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

// Returns default photos for non-existant users, users with no profile photos, or default users
export const photoUrl = (user) => {
  if (!user)
    return DEFAULT_PHOTO_URL;
  else if (user.photo_url)
    return user.photo_url;
  else if (DEFAULT_USER_PHOTO_URLS[user.id])
    return DEFAULT_USER_PHOTO_URLS[user.id];
  else
    return DEFAULT_PHOTO_URL;
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

export const getFileTypeInfo = (file) => {
  let fileName = file.name.slice(file.name.indexOf(".") + 1);
  if (fileName.length == file.name.length)
    fileName = "";

  switch (fileName) {
    case "doc":
    case "docx":
      return {name: "Word Document", iconSymbol: "far fa-file-word fa-fw", iconBackground: "file-darkblue-back"};
    case "ppt":
    case "pptx":
      return {name: "Powerpoint Presentation", iconSymbol: "far fa-file-powerpoint fa-fw", iconBackground: "file-orange-back"};
    case "xls":
    case "xlsx":
      return {name: "Excel Spreadsheet", iconSymbol: "far fa-file-excel fa-fw", iconBackground: "file-green-back"};
    case "":
    case "txt":
    case "rtf":
      return {name: "Plain Text", iconSymbol: "far fa-file-alt fa-fw", iconBackground: "file-lightblue-back"};
    case "pdf":
      return {name: "PDF", iconSymbol: "far fa-file-pdf fa-fw", iconBackground: "file-red-back"};
    case "zip":
      return {name: "Zip", iconSymbol: "far fa-file-archive fa-fw", iconBackground: "file-darkblue-back"}
    case "mp4":
    case "wmv":
    case "mov":
    case "avi":
    case "mpg":
    case "mpg2":
      return {name: "Video", iconSymbol: "far fa-file-video fa-fw", iconBackground: "file-grey-back"}
    case "mp3":
    case "m4a":
    case "flac":
    case "wav":
    case "wma":
    case "aac":
      return {name: "Audio", iconSymbol: "far fa-file-audio fa-fw", iconBackground: "file-grey-back"}
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "bmp":
      return {name: fileName.toUpperCase(), iconSymbol: "far fa-file-image fa-fw", iconBackground: "file-grey-back"}
    default:
      return {name: fileName ? fileName.toUpperCase() : "File", iconSymbol: "far fa-file fa-fw", iconBackground: "file-lightblue-back"}
  }
}