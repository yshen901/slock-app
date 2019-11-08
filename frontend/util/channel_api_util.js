export const getChannels = (workspaceId) => (
  $.ajax({
    method: "GET",
    url: `/api/workspaces/${workspaceId}/channels`
  })
)

export const getChannel = (channelId) => (
  $.ajax({
    method: "GET",
    url: `/api/channels/${channelId}`
  })
)

export const postChannel = (channel) => (
  $.ajax({
    method: "POST",
    url: "/api/channels",
    data: {channel}
  })
)

export const deleteChannel = (channelId) => (
  $.ajax({
    method: "DELETE",
    url: `/api/channels/${channelId}`
  })
)
