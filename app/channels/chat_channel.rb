#AC
class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_for "chat_channel"
  end

  def speak(data)
    message_data = data['message']

    # handles new message post request
    # passes up activate_dm_channel to tell the app to fire startDmChannel, which loads the channel
    if message_data['type'] == "PUT"
        socket = { 
          message: {
            type: message_data["type"],
            message: message_data["message"],
            dm_channel: message_data["dm_channel"]
          }
        }
        ChatChannel.broadcast_to('chat_channel', socket)

    # handles delete message request
    elsif message_data['type'] == "DELETE"
      ChatChannel.broadcast_to('chat_channel', {
        message: {
          type: message_data['type'], 
          id: message_data["id"],
          user_id: message_data["user_id"]
        }
      })
    elsif message_data['type'] == "RECEIVE_MESSAGE_REACT" || message_data['type'] == "REMOVE_MESSAGE_REACT"
      ChatChannel.broadcast_to('chat_channel', {
        message: {
          type: message_data['type'], 
          id: message_data["message_react"]["message_id"],
          user_id: message_data["message_react"]["user_id"],
          react_code: message_data["message_react"]["react_code"]
        }
      })
    elsif message_data['type'] == "RECEIVE_MESSAGE_SAVE" || message_data['type'] == "REMOVE_MESSAGE_SAVE"
      ChatChannel.broadcast_to('chat_channel', {
        message: {
          type: message_data['type'], 
          id: message_data["id"],
          message_save_id: message_data["message_save_id"],
          message: message_data["message"],
        }
      })
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
