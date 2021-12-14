if logged_in?
  json.workspace do
    json.partial! '/api/workspaces/workspace', workspace: @workspace
  end

  json.users({})
  json.users do
    @workspace.users.each do |user|
      json.set! user.id do
        json.partial! '/api/users/user', user: user
      end
    end
  end

  # NOTE: HOW TO RETURN AN OBJECT INSTEAD OF AN ARRAY

  # Pull out all user channel information - channels, dm_channels, and active_dm_channels
  # Remember to sort and only select current workspace channels!
  user_channel_ids = []
  @current_user.channel_connections.each do |connection|
    user_channel_ids << connection.channel_id if connection.workspace_id == @workspace.id
  end

  user_dm_channel_ids_all = []
  user_dm_channel_ids_active = []
  @current_user.dm_channel_connections_1.each do |connection|
    if connection.workspace_id == @workspace.id
      user_dm_channel_ids_all << connection.channel_id
      user_dm_channel_ids_active << connection.channel_id if connection.active_1
    end
  end
  @current_user.dm_channel_connections_2.each do |connection|
    if connection.workspace_id == @workspace.id
      user_dm_channel_ids_all << connection.channel_id
      user_dm_channel_ids_active << connection.channel_id if connection.active_2
    end
  end
  
  json.user_channels({})
  json.user_channels do
    user_channel_ids.each do |channel_id|
      json.set! channel_id do
        json.id channel_id
      end
    end

    user_dm_channel_ids_active.each do |channel_id|
      json.set! channel_id do
        json.id channel_id
      end
    end
  end

  json.channels({})
  json.channels do
    @workspace.channels.each do |channel|
      unless channel.dm_channel
        json.set! channel.id do
          json.partial! 'api/channels/channel', channel: channel
        end
      end
    end

    @workspace.channels.each do |channel|
      if channel.dm_channel && user_dm_channel_ids_all.include?(channel.id)
        json.set! channel.id do
          json.partial! 'api/channels/channel', channel: channel
        end
      end
    end
  end
end