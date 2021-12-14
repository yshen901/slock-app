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

    channel = message.channel

    # If the message's channel is a dm_channel and one user is inactive
    if channel.dm_channel 
      connection = channel.dm_channel_connection
      activate_dm_channel = !(connection.active_1 && connection.active_2)
    end

    # Activate the link behind the scenes
    if activate_dm_channel 
      DmChannelUser.find_by(channel_id: message.channel_id).update(
        active_1: true,
        active_2: true
      )
    end

    # Passes up activate_dm_channel to tell the app to fire startDmChannel, which loads the channel
    socket = { 
      message: {
        body: message_data['body'],
        created_at: message_data['created_at'],
        user_id: message_data['user_id'],
        channel_id: message_data['channel_id'],
        # activate_dm_channel: activate_dm_channel
      }
    }
    ChatChannel.broadcast_to('chat_channel', socket)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
