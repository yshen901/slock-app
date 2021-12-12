class ApplicationController < ActionController::Base
  helper_method :current_user, :current_workspaces, :logged_in?
  protect_from_forgery unless: -> { request.format.json? }

  # Called once by root to bootstrap current_workspaces
  def current_user
    return nil unless session[:session_token]

    # AVOID N+1 BY INCLUDING CONNECTIONS
    # @current_user ||= User.includes(workspaces: [:connections]).find_by_session_token(session[:session_token])
    @current_user ||= User.find_by_session_token(session[:session_token])
  end


  # Called once by root to bootstrap current_workspaces
  def current_workspaces
    return nil unless session[:session_token]

    # AVOID N+1 BY INCLUDING CONNECTIONS
    # @current_workspaces ||= Workspace.joins(:users).where("logged_in = true AND users.id = #{current_user.id}");
    @current_workspaces ||= Workspace.includes(:connections).joins(:users).where("logged_in = true AND users.id = #{current_user.id}");
  end

  # logs in the user
  def login!(user, workspace=nil)
    session[:session_token] = user.reset_session_token
    @current_user = user
    
    # If we're logging into a workspace
    if workspace
      connection = WorkspaceUser.find_by(workspace_id: workspace[:id], user_id: user.id)
      if connection
        connection.login!
      end
    end
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
