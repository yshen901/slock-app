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
        channel_id: channel_user_params[:channel_id],
        workspace_id: channel_user_params[:workspace_id]
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

  def update
    @channel_user = ChannelUser.find_by(
      user_id: current_user.id,
      channel_id: channel_user_params[:channel_id]
    )

    if @channel_user
      if @channel_user.update(channel_user_params)
        render 'api/channel_users/show'
      else
        render json: ["Channel update failed!"]
      end
    else
      render json: ["User is not in the channel."]
    end
  end

  private

  def channel_user_params
    params.require(:channel_user).permit(:channel_id, :workspace_id, :starred)
  end
end
