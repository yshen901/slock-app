class ApplicationController < ActionController::Base
  helper_method :current_user, :current_workspace, :logged_in?

  # finds the currently logged in user
  def current_user
    return nil unless session[:session_token]
    @current_user ||= User.find_by_session_token(session[:session_token])
  end

  def current_workspace
    return nil unless session[:session_token]
    # debugger # STEP 1: FIND THE WORKSPACE THE CURRENT_USER IS LOGGED INTO
    connection = WorkspaceUser.find_by(user_id: current_user[:id], logged_in: true)
    @current_workspace ||= Workspace.find_by_id(connection[:workspace_id])
  end

  # logs in the user
  def login!(user, workspace)
    session[:session_token] = user.reset_session_token
    @current_user = user
    
    connections = user.connections;
    connections.each do |connection|
      connection[:workspace_id] == workspace[:id] ? connection.login! : connection.logout!
    end
    
    debugger
  end

  # returns whether the user is logged in
  def logged_in?
    !!current_user
  end

  # logs out the user, and sets all of their workspaces to logged_out
  def logout!
    current_user.reset_session_token
    session[:session_token] = nil
  end

  # ???
  def require_login
    puts "TBD"
  end
end
