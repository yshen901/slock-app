export const getMessages = (channel_id) => (
  $.ajax({
    method: "GET",
    url: `/api/channels/${channel_id}/messages`
  })
);

// message contains body and id
export const updateMessage = (message) => {
  return $.ajax({
    method: "PATCH",
    url: `/api/messages/${message.id}`,
    data: {message}
  })
};