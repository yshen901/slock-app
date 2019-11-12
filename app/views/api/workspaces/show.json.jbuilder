json.workspace do
  json.partial! '/api/workspaces/workspace', workspace: @workspace
end

json.users do
  json.array! @workspace.users do |user|
    json.partial! 'api/users/user', user: user
  end
end

json.user_channels do
  json.array! current_user.channels.where("workspace_id = #{@workspace.id}") do |channel|
    json.id channel.id
  end
end
