class Api::WorkspacesController < ApplicationController
  # DESIGN: workspace's show's ":id" will refer to the address rather than id
  # TODO: Make a custom route '/api/workspace/:address' so this is less hacky
  def show
    @workspace = Workspace.find_by_address(params[:id])
    if @workspace 
      render '/api/workspaces/show'
    else
      render json: ["Workspace does not exist"], status: 402
    end
  end
end
