class Api::SessionsController < ApplicationController
  def create 
    @user = User.find_by_credentials(
      params[:user][:email],
      params[:user][:password]
    )
    workspace = Workspace.find_by_address(params[:user][:workspace_address])
    if !workspace
      render json: ["Workspace doesn't exist"], status: 401
    elsif !@user
      render json: ["Email/Password combination doesn't exist on this workspace"], status: 401
    else
      login!(@user)
      connection = WorkspaceUser.find_by(user_id: @user.id, workspace_id: workspace.id)
      connection.login!
      debugger
      render 'api/users/show'
    end
  end

  def destroy
    if logged_in?
      logout!
      render json: ["Logged Out"]
    else
      render json: ["No one is logged in"], status: 401
    end
  end
end
