class UsersController < ApplicationController
  def create
    # find the user and the workspace
    @user = User.find_by_credentials(
      user_params[:user][:email]
      user_params[:user][:password]
    )
    workspace = Workspace.find_by_address(user_params[:user][:workspace_address])

    # 3 cases:
    #   a) workspace doesn't exist             => render errors
    #   b) workspace and user both exist       => establish a connection
    #                                                 if it works, login the user and render show
    #                                                 if not     , render errors
    #   c) workspace exists but user doesn't   => make a new user
    #                                                 if it works, login the user and establish connection
    #                                                 if not     , render errors
    if !workspace
      render json: ["Workspace doesn't exist"], status: 401
    elsif @user
      connection = WorkspaceUser.new(user_id: @user.id, workspace_id: workspace.id, logged_in: true)
      if connection.save
        login!(@user)
        render '/api/users/show'
      else
        render json: connection.errors.full_messages, status: 401
      end
    else
      @user = User.new(
        email: user_params[:user][:email],
        password: user_params[:user][:password]
      )
      if @user.save
        WorkspaceUser.create(user_id: @user.id, workspace_id: workspace.id, logged_in: true)
        login!(@user)
        render '/api/users/show'
      else
        render json: @user.errors.full_messages, status: 401
      end
    end
  end

  private

  def user_params 
    params.require(:user).permit(:email, :password, :workspace_address)
  end
end
