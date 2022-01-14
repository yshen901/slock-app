json.id message.id
json.user_id message.user_id
json.channel_id message.channel_id
json.body message.body
json.created_at message.created_at

message_reacts = message.message_reacts

total_reacts = Hash.new(0)
user_reacts = {}
message_reacts.each do |message_react|
  total_reacts[message_react.react_code] += 1
  
  user_reacts[message_react.user_id] ||= {}
  user_reacts[message_react.user_id][message_react.react_code] = true
end

json.total_reacts total_reacts
json.user_reacts user_reacts

json.files message.files.map{ |file| { name: file.filename.to_s, url: file.service_url } }