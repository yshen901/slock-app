class Api::UsersController < ApplicationController
  def create
    # find the user and the workspace
    @user = User.find_by_credentials(
      user_params[:email],
      user_params[:password]
    )
    workspace = Workspace.find_by_address(user_params[:workspace_address])

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
      connection = WorkspaceUser.find_by(user_id: @user.id, workspace_id: workspace.id);
      if connection
        render json: ["User already exists"], status: 401
      else
        connection = WorkspaceUser.new(user_id: @user.id, workspace_id: workspace.id, logged_in: true)
        if connection.save
          login!(@user, workspace)
          render '/api/users/show'
        else
          render json: connection.errors.full_messages, status: 401
        end
      end
    else
      @user = User.new(
        email: user_params[:email],
        password: user_params[:password]
      )
      if @user.save
        WorkspaceUser.create(user_id: @user.id, workspace_id: workspace.id, logged_in: true)
        channel = @user.workspaces[0].channels[0];
        ChannelUser.create(user_id: @user.id, channel_id: channel.id);
        login!(@user, workspace)
        render '/api/users/show'
      else
        render json: @user.errors.full_messages, status: 401
      end
    end
  end

  # Only for updating photo, and later name
  def update
    @user = User.find_by(id: params[:id])

    if (@user) 
      @user.photo.attach(user_params[:photo]);
      if @user.save
        render :show
      else
        render json: @user.errors.full_messages, status: 401
      end
    else
      render json: ["User not found!"], status: 400
    end
  end

  private
  def user_params 
    params.require(:user).permit(:email, :password, :workspace_address, :photo)
  end
end
