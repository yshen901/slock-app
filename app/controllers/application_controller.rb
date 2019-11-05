class ApplicationController < ActionController::Base
  helper_method :current_user, :logged_in?

  # finds the currently logged in user
  def current_user
    return nil unless session[:session_token]
    @current_user ||= User.find_by_session_token(session[:session_token])
  end

  # logs in the user
  def login!(user)
    session[:session_token] = user.reset_session_token
    # @current_user = user
  end

  # returns whether the user is logged in
  def logged_in?
    !!current_user
  end

  # logs out the user, and sets all of their workspaces to logged_out
  def logout!
    debugger
    current_user.connections.each do |connection| 
      connection.logout!
    end

    current_user.reset_session_token
    session[:session_token] = nil
  end

  # ???
  def require_login
    puts "TBD"
  end
end
