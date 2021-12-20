// data has channel_id and workspace_id
// creates or activates the channel connection
export const postChannelUser = (channel_user) => (
  $.ajax({
    method: "POST",
    url: "/api/channel_users",
    data: {channel_user}
  })
)

// Find using channel_id and current_user.id in rails
// params id is 0 as a placeholder
// deprecated
export const deleteChannelUser = (channel_id) => (
  $.ajax({
    method: "DELETE",
    url: `/api/channel_users/0`,
    data: {channel_user: {channel_id}}
  })
)

// Find using channel_id and current_user.id in rails
// params id is 0 as a placeholder
export const updateChannelUser = (channel_user) => (
  $.ajax({
    method: "PATCH",
    url: `/api/channel_users/0`,
    data: {
      channel_user
    }
  })
)