export const postChannelUser = (channel_id) => (
  $.ajax({
    method: "POST",
    url: "/api/channel_users",
    data: {channel_user: {channel_id}}
  })
)

export const deleteChannelUser = (channel_id) => (
  $.ajax({
    method: "DELETE",
    url: `/api/channel_users/0`,
    data: {channel_user: {channel_id}}
  })
)