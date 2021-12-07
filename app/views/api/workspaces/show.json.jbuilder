if logged_in?
  json.workspace do
    json.partial! '/api/workspaces/workspace', workspace: @workspace
  end

  json.users do
    @workspace.users.each do |user|
      json.set! user.id do
        json.partial! 'api/users/user', user: user
      end
    end
  end

  # NOTE: HOW TO RETURN AN OBJECT INSTEAD OF AN ARRAY

  user_channel_ids = @current_user.channels.map { |channel| channel.id }
  user_dm_channel_ids = @current_user.dm_channels_1.map { |channel| channel.id }
  user_dm_channel_ids.concat(@current_user.dm_channels_2.map { |channel| channel.id })

  json.user_channels do
    user_channel_ids.each do |channel_id|
      json.set! channel_id do
        json.id channel_id
      end
    end

    user_dm_channel_ids.each do |channel_id|
      json.set! channel_id do
        json.id channel_id
      end
    end
  end

  json.channels do
    @workspace.channels.each do |channel|
      unless channel.dm_channel
        json.set! channel.id do
          json.partial! 'api/channels/channel', channel: channel
        end
      end
    end

    @workspace.channels.each do |channel|
      if channel.dm_channel && user_dm_channel_ids.include?(channel.id)
        json.set! channel.id do
          json.partial! 'api/channels/channel', channel: channel
        end
      end
    end
  end
end