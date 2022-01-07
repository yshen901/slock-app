message_saves = {}

json.messages({})
json.messages do
  @message_saves.each do |message_save|
    message_saves[message_save.message_id] = message_save;
    message = message_save.message
    json.set! message.id do
      json.partial! "/api/messages/message", message: message
    end
  end
end
json.message_saves message_saves