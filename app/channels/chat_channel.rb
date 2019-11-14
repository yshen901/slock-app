#AC
class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_for "chat_channel"
  end

  def speak(data)
    message = Message.create(
      body: data['message']['body'], 
      user_id: data['message']['user_id'], 
      channel_id: data['message']['channel_id']
    )
    socket = { message: message.body }
    ChatChannel.broadcast_to('chat_channel', socket)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
