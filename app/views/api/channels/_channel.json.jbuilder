json.id channel.id
json.name channel.name
json.workspace_id channel.workspace_id
json.users do
  json.array! channel.users do |user|
    json.id user.id
  end
end