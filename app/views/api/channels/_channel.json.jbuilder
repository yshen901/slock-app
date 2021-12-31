json.id channel.id
json.name channel.name
json.workspace_id channel.workspace_id
json.description channel.description
json.topic channel.topic
json.dm_channel channel.dm_channel  
json.created_at channel.created_at

# handles things differently depending on what the channel is
# returns channels users to make it easier to display channel name
json.users({})
if channel.dm_channel
  dm_channel_user = channel.dm_channel_connection
  json.users do
    json.set! dm_channel_user.user_1_id do
      json.id dm_channel_user.user_1_id
    end
    json.set! dm_channel_user.user_2_id do
      json.id dm_channel_user.user_2_id
    end
  end

  if dm_channel_user.user_1_id == current_user.id
    json.starred dm_channel_user.starred_1
  else
    json.starred dm_channel_user.starred_2
  end
else
  channel_connections = @single_channel_connection ? [@single_channel_connection] : channel.channel_connections
  starred = false
  json.users do
    channel_connections.each do |channel_connection|
      if (channel_connection.active)
        json.set! channel_connection.user_id do
          json.id channel_connection.user_id
        end

        if channel_connection.user_id == current_user.id
          starred = channel_connection.starred
        end
      end
    end
  end
  json.starred starred
end