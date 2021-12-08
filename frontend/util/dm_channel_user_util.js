// Pass workspace_id, user_1_id, user_2_id
// This workspace id will be used to make a new channel should one not be found
export const startDmChannel = (dm_channel_user) => {
  return $.ajax({
    method: "POST",
    url: "/api/dm_channel_users",
    data: {dm_channel_user}
  });
};

// Disables the channel using the channel_id, user_id, and active
// Which user is toggled is determined in controller
export const leaveDmChannel = (dm_channel_user) => {
  return $.ajax({
    method: "PATCH",
    url: `/api/dm_channel_users/${dm_channel_user.channel_id}`,
    data: { dm_channel_user }
  });
};



// FOR TESTING
export const createTestData = {
  user_1_id: 2,
  user_2_id: 7,
  channel_id: 7
};

export const disableTestData = {
  channel_id: 7,
  active_1: false
};
