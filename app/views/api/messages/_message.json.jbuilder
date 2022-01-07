json.id message.id
json.user_id message.user_id
json.channel_id message.channel_id
json.body message.body
json.created_at message.created_at

message_reacts = message.message_reacts

total_reacts = Hash.new(0)
message_reacts.each do |message_react|
  total_reacts[message_react.react_code] += 1
end
json.total_reacts total_reacts