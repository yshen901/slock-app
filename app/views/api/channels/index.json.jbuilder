json.channels do
  json.extract! @channels do |channel|
    json.partial! 'api/channels/channel', channel: channel
  end
end