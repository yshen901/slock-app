class Api::SessionsController < ApplicationController
  def create 
    workspace = Workspace.find_by_address(params[:user][:workspace_address])
    if !workspace
      render json: ["Workspace doesn't exist"], status: 401
    else
      @user = workspace.users.find_by_credentials(
        params[:user][:email],
        params[:user][:password]
      )
      if @user
        login!(@user, workspace)
        render 'api/users/show'
      else
        render json: ["Email/Password combination doesn't exist on this workspace"], status: 401
      end
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
