json.id @dm_channel_user.id
json.user_1_id @dm_channel_user.user_1_id
json.user_2_id @dm_channel_user.user_2_id
json.channel_id @dm_channel_user.channel_id
json.active_1 @dm_channel_user.active_1
json.active_2 @dm_channel_user.active_2

# Passes out channel information in order to receive new channel
if @channel
  json.channel do 
    json.partial! 'api/channels/channel', channel: @channel
  end
else
  json.channel do
    json.partial! 'api/channels/channel', channel: @dm_channel_user.channel
  end
end