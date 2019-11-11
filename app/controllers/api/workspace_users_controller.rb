class Api::WorkspaceUsersController < ApplicationController
  # DESIGN: PARAMS[:ID] REFERS TO THE WORKSPACE ID HERE NOT THE CONNECTION ID...HOW TO CIRCUMVENT THIS
  def update 
    @connection = WorkspaceUser.find_by(user_id: current_user.id, workspace_id: params[:id])
    if @connection
      if workspace_user_params[:logged_in] == "true"
        @connection.login!
      elsif workspace_user_params[:logged_in] == "false"
        @connection.logout!
      end
      render '/api/workspace_users/show'
    else
      render json: ['Logout Unsuccessful'], status: 401
    end
  end

  private

  def workspace_user_params
    params.require(:workspace_user).permit(:logged_in, :user_email, :workspace_id)
  end
end
