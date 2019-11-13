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
json.channels do
  @workspace.channels.each do |channel|
    json.set! channel.id do
      json.partial! 'api/channels/channel', channel: channel
    end
  end
end

if current_user
  user_channels = current_user.channels.where("workspace_id = #{@workspace.id}")
  json.user_channels do
    user_channels.each do |channel|
      json.set! channel.id do
        json.id channel.id
      end
    end
  end
end
