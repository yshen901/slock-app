json.id channel.id
json.name channel.name
json.workspace_id channel.workspace_id

json.users do
  channel.users.each do |user|
    json.set! user.id do
      json.id user.id
    end
  end
end
