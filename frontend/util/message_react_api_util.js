// Creates using message_id and react_code
export const postMessageReact = (message_react) => (
  $.ajax({
    method: "POST",
    url: "/api/message_reacts",
    data: { message_react }
  })
);

// Placeholder url id, found with message_id and react_code
export const deleteMessageReact = (message_react) => (
  $.ajax({
    method: "DELETE",
    url: "/api/message_reacts/0",
    data: { message_react }
  })
);