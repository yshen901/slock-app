json.id channel.id
json.name channel.name
json.workspace_id channel.workspace_id
json.description channel.description
json.starred channel.starred
json.dm_channel channel.dm_channel  

# handles things differently depending on what the channel is
if channel.dm_channel
  json.users do
    json.set! channel.dm_user_1.id do
      json.id channel.dm_user_1.id
    end
    json.set! channel.dm_user_2.id do
      json.id channel.dm_user_2.id
    end
  end
else
  json.users do
    channel.users.each do |user|
      json.set! user.id do
        json.id user.id
      end
    end
  end
end
