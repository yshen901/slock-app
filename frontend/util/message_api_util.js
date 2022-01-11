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
  });
};

// message contains channel_id and body
export const createMessage = (message) => {
  return $.ajax({
    method: "PUT",
    url: '/api/messages',
    data: {message}
  });
};

// message only contains the id
export const deleteMessage = (message) => {
  return $.ajax({
    method: "DELETE",
    url: `/api/messages/${message.id}`
  });
};