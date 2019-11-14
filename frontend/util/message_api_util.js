export const getMessages = (channel_id) => (
  $.ajax({
    method: "GET",
    url: `/api/channels/${channel_id}/messages`
  })
);