json.id workspace.id
json.address workspace.address

if @connection 
  json.num_users workspace.connections.length + 1
else
  json.num_users workspace.connections.length
end
json.num_logged_in_users workspace.connections.count{ |connection| connection.logged_in }