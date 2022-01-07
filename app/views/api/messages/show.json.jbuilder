json.partial! "api/messages/message", message: @message
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