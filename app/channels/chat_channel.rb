#AC
class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_for "chat_channel"
  end

  def speak(data)
    message_data = data['message']
    message = Message.create(
      body: message_data['body'], 
      user_id: message_data['user_id'], 
      channel_id: message_data['channel_id']
    )
    socket = { 
      message: {
        body: message_data['body'],
        created_at: message_data['created_at'],
        user_id: message_data['user_id'],
        channel_id: message_data['channel_id']
      }
    }
    ChatChannel.broadcast_to('chat_channel', socket)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
