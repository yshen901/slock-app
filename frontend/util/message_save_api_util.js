// Creates using message_id and react_code
export const postMessageSave = (message_save) => (
  $.ajax({
    method: "POST",
    url: "/api/message_saves",
    data: { message_save }
  })
);

// Placeholder url id, found with message_id and react_code
export const deleteMessageSave = (message_save) => (
  $.ajax({
    method: "DELETE",
    url: "/api/message_saves/0",
    data: { message_save }
  })
);