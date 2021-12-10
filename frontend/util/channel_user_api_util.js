// data has channel_id and workspace_id
export const postChannelUser = (data) => (
  $.ajax({
    method: "POST",
    url: "/api/channel_users",
    data
  })
)

export const deleteChannelUser = (channel_id) => (
  $.ajax({
    method: "DELETE",
    url: `/api/channel_users/0`,
    data: {channel_user: {channel_id}}
  })
)