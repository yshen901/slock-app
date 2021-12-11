json.id workspace.id
json.address workspace.address

if @connection 
  json.num_users workspace.connections.length + 1
else
  json.num_users workspace.connections.length
end

num_logged_in_users = 0
json.users do
  workspace.connections.each do |connection|
    json.set! connection.user_id do
      json.id connection.user_id
      json.logged_in connection.logged_in
    end
    if connection.logged_in
      num_logged_in_users += 1
    end
  end
end
json.num_logged_in_users num_logged_in_users