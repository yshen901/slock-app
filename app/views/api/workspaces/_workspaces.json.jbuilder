workspaces.each do |workspace|
  json.set! workspace.id do
    json.extract! workspace, :id, :address
    json.num_users workspace.users.length
  end
end