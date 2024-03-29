class Api::WorkspaceUsersController < ApplicationController
  def create 
    user = User.find_by_email(workspace_user_params[:user_email])
    workspace = Workspace.find_by_address(workspace_user_params[:workspace_address])

    if user && workspace
      @connection = WorkspaceUser.find_by(user_id: user.id, workspace_id: workspace.id)
      if !@connection
        @connection = WorkspaceUser.new(user_id: user.id, workspace_id: workspace.id, logged_in: false)
        @connection.save
        render '/api/workspace_users/show'
      else
        render json: ["User is already part of the workspace."], status: 409
      end
    else
      render json: ["User does not exist."], status: 404
    end
  end

  # DESIGN: PARAMS[:ID] REFERS TO THE WORKSPACE ID HERE NOT THE CONNECTION ID...HOW TO CIRCUMVENT THIS
  def update 
    @connection = WorkspaceUser.find_by(user_id: current_user.id, workspace_id: params[:id])
    if @connection
      @connection.update(workspace_user_params)
      render '/api/workspace_users/show'
    else
      render json: ['CONNECTION INVALID'], status: 404
    end
  end

  private

  def workspace_user_params
    params.require(:workspace_user).permit(:logged_in, :user_email, :workspace_id, :workspace_address, :active, :status, :paused)
  end
end
