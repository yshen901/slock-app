class Api::ChannelUsersController < ApplicationController
  def create
    @channel_user = ChannelUser.find_by(
      user_id: current_user.id,
      channel_id: channel_user_params[:channel_id]
    )

    if @channel_user
      render json: ["User is already in the channel"], status: 401
    else
      @channel_user = ChannelUser.new(
        user_id: current_user.id,
        channel_id: channel_user_params[:channel_id]
      )
      if @channel_user.save
        render 'api/channel_users/show'
      else
        render json: ["Failed to join channel"], status: 401
      end
    end
  end

  def destroy 
    @channel_user = ChannelUser.find_by(
      user_id: current_user.id,
      channel_id: channel_user_params[:channel_id]
    )

    if @channel_user
      @channel_user.destroy
      render 'api/channel_users/show'
    else
      render json: ["User has already left the channel"], status: 401
    end
  end

  private

  def channel_user_params
    params.require(:channel_user).permit(:channel_id)
  end
end
