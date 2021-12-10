# How to use a partial with jbuilder! Partials are good for bootstrapping?
#   *** for partials, write path relative to views folder
json.partial! '/api/users/user', user: @user

json.workspaces({})
json.workspaces do 
  @user.workspaces.each do |workspace|
    json.set! workspace.id do
      json.partial! '/api/workspaces/workspace', workspace: workspace
    end
  end
  if @new_workspace
    json.set! workspace.id do
      json.partial! '/api/workspaces/workspace', workspace: @new_workspace
    end
  end
end