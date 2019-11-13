class Api::WorkspacesController < ApplicationController
  # DESIGN: workspace's show's ":id" will refer to the address rather than id
  def show
    @workspace = Workspace.find_by_address(params[:id])
    if @workspace 
      render '/api/workspaces/show'
    else
      render json: ["Workspace does not exist"], status: 402
    end
  end

  
  # DESIGN: Gets all logged_in workspaces of the current_user
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

      general_channel = Channel.create({name: "general", workspace_id: @workspace.id})
      custom_channel = Channel.create({name: channel_params[:channel], workspace_id: @workspace.id})

      ChannelUser.create(channel_id: general_channel.id, user_id: current_user.id)
      ChannelUser.create(channel_id: custom_channel.id, user_id: current_user.id)

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
