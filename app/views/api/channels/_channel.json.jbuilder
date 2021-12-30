json.id channel.id
json.name channel.name
json.workspace_id channel.workspace_id
json.description channel.description
json.topic channel.topic
json.dm_channel channel.dm_channel  

# handles things differently depending on what the channel is
# returns channels users to make it easier to display channel name
json.users({})
if channel.dm_channel
  json.users do
    json.set! channel.dm_user_1.id do
      json.id channel.dm_user_1.id
    end
    json.set! channel.dm_user_2.id do
      json.id channel.dm_user_2.id
    end
  end
  json.starred false
else
  channel_connections = @single_channel_connection ? [@single_channel_connection] : channel.channel_connections
  starred = false
  json.users do
    channel_connections.each do |channel_connection|
      json.set! channel_connection.user_id do
        json.id channel_connection.user_id
      end

      if channel_connection.user_id == current_user.id
        starred = channel_connection.starred
      end
    end
  end
  json.starred starred
end