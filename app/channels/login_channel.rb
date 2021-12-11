#AC
class LoginChannel < ApplicationCable::Channel
  def subscribed
    stream_for "login_channel"
  end

  def speak(data)
    workspace_data = data['workspace_data']
    channel_data = data['channel_data']
    if workspace_data
      socket = { 
        workspace_data: {
          user_id: workspace_data['user_id'],
          logged_in: workspace_data['logged_in'],
          workspace_id: workspace_data['workspace_id']
        }
      }
    elsif channel_data 
      socket = { 
        channel_data: {
          user_id: channel_data['user_id'],
          channel_id: channel_data['channel_id'],
          login: channel_data['login']
        }
      }
    else
      socket = {}
    end
    LoginChannel.broadcast_to('login_channel', socket)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
