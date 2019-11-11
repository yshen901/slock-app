class Api::WorkspacesController < ApplicationController
  # DESIGN: workspace's show's ":id" will refer to the address rather than id
  # TODO2: Make a custom route '/api/workspace/:address' so this is less hacky
  def show
    @workspace = Workspace.find_by_address(params[:id])
    if @workspace 
      render '/api/workspaces/show'
    else
      render json: ["Workspace does not exist"], status: 402
    end
  end

  # DESIGN: Gets all logged_in workspaces of the current_user
  # TODO: MAKE THIS CUSTOM ROUTE TO MAKE THIS LESS HACKY
  def index
    @workspaces = Workspace.joins(:users).where("users.id = #{current_user.id} AND logged_in = true")
    # @workspaces = Workspace.all
    render '/api/workspaces/index'
  end

  def create 
    @workspace = Workspace.new(workspace_params)
    if !current_user
      render json: ["I don't know how you did this but this is illegal"], status: 402
    elsif @workspace.save
      connection = WorkspaceUser.create(user_id: current_user.id, workspace_id: @workspace.id, logged_in: true)
      channel = Channel.create({name: channel_params[:channel], workspace_id: @workspace.id})
      render '/api/workspaces/show'
    else
      render json: ["Workspace name is invalid or already taken"], status: 402
    end
  end

  private

  def workspace_params 
    params.require(:workspace).permit(:address)
  end

  def channel_params 
    params.require(:workspace).permit(:channel)
  end
end
