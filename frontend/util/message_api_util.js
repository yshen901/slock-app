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
export const createMessage = (formData) => {
  return $.ajax({
    method: "POST",
    url: '/api/messages',
    data: formData,
    contentType: false,
    processData: false
  });
};

// message only contains the id
export const deleteMessage = (message) => {
  return $.ajax({
    method: "DELETE",
    url: `/api/messages/${message.id}`
  });
};