// data has channel_id and workspace_id
export const postChannelUser = (channel_user) => (
  $.ajax({
    method: "POST",
    url: "/api/channel_users",
    data: {channel_user}
  })
)

export const deleteChannelUser = (channel_id) => (
  $.ajax({
    method: "DELETE",
    url: `/api/channel_users/0`,
    data: {channel_user: {channel_id}}
  })
)