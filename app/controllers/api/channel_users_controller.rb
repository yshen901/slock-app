class Api::ChannelUsersController < ApplicationController
  def create
    @channel_user = ChannelUser.find_by(
      user_id: current_user.id,
      channel_id: channel_user_params[:channel_id]
    )
    
    # Activate channel_user if its already existing
    if @channel_user
      if @channel_user.active
        render json: ["User is already in the channel"], status: 409
      else
        @channel_user.update(active: true)
        render :show
      end
    else
      @channel_user = ChannelUser.new(
        user_id: current_user.id,
        channel_id: channel_user_params[:channel_id],
        workspace_id: channel_user_params[:workspace_id]
      )
      if @channel_user.save
        render 'api/channel_users/show'
      else
        render json: ["Failed to join channel"], status: 409
      end
    end
  end

  # deprecated
  def destroy 
    @channel_user = ChannelUser.find_by(
      user_id: current_user.id,
      channel_id: channel_user_params[:channel_id]
    )

    if @channel_user
      @channel_user.destroy
      render 'api/channel_users/show'
    else
      render json: ["User has already left the channel"], status: 404
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
        render json: ["Channel update failed!"], status: 409
      end
    else
      render json: ["User is not in the channel."], status: 404
    end
  end

  private

  def channel_user_params
    params.require(:channel_user).permit(:channel_id, :workspace_id, :starred, :active)
  end
end
