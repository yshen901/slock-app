#AC
class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_for "chat_channel"
  end

  def speak(data)
    message_data = data['message']
    message = Message.new(
      body: message_data['body'], 
      user_id: message_data['user_id'], 
      channel_id: message_data['channel_id']
    )

    if message.save 
      channel = message.channel

      # If the message's channel is a dm_channel, send up activate_dm_channel to tell the app to activate it
      activate_dm_channel = channel.dm_channel && channel.active_1 && channel.active_2

      socket = { 
        message: {
          body: message_data['body'],
          created_at: message_data['created_at'],
          user_id: message_data['user_id'],
          channel_id: message_data['channel_id'],
          activate_dm_channel: activate_dm_channel
        }
      }
      ChatChannel.broadcast_to('chat_channel', socket)
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
