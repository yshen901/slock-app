#AC
class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_for "chat_channel"
  end

  def speak(data)
    message_data = data['message']

    # handles new message post request
    if message_data['type'] == "PUT"
      message = Message.new(
        body: message_data['body'], 
        user_id: message_data['user_id'], 
        channel_id: message_data['channel_id']
      )
      
      # use new+save instead of create so we can determine whether it failed or succeeded
      # only broadcast if it worked
      if message.save 
        # If the message's channel is a dm_channel and one user is inactive
        channel = message.channel
        connection = channel.dm_channel_connection
        if connection
          activate_dm_channel = !(connection.active_1 && connection.active_2)
        end
  
        # Activate the link behind the scenes
        if activate_dm_channel 
          connection.update(
            active_1: true,
            active_2: true
          )
        end
  
        # Passes up activate_dm_channel to tell the app to fire startDmChannel, which loads the channel
        socket = { 
          message: {
            type: "PUT",
            body: message_data['body'],
            created_at: message_data['created_at'],
            user_id: message_data['user_id'],
            channel_id: message_data['channel_id'],
            activate_dm_channel: activate_dm_channel,
            id: message.id,
            total_reacts: {},
            user_reacts: {}
          }
        }
        ChatChannel.broadcast_to('chat_channel', socket)
      end
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
