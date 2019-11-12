json.channels do
  json.array! @channels do |channel|
    json.partial! 'api/channels/channel', channel: channel
  end
end

json.users do
  json.array! @channels[0].workspace.users do |user|
    json.partial! 'api/users/user', user: user
  end
end