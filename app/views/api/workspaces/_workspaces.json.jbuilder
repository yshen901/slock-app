workspaces.each do |workspace|
  json.set! workspace.id do
    json.extract! workspace, :id, :address
  end
end