class Api::DmChannelUsersController < ApplicationController
  def create
    # Find the connection if you can
    @dm_channel_user = DmChannelUser.where(
      "
        (user_1_id = #{dm_channel_user_params[:user_1_id]} AND user_2_id = #{dm_channel_user_params[:user_2_id]})
        OR
        (user_1_id = #{dm_channel_user_params[:user_2_id]} AND user_2_id = #{dm_channel_user_params[:user_1_id]})
      "
    ).first;

    # ASSUMPTION: Channel is already made and has been passed up
    # If connection is found, reactivate the right index
    # If connection isn't found, make a new one
    if @dm_channel_user
      if @dm_channel_user.user_1_id == current_user.id
        updated = @dm_channel_user.update(active_1: true)
      else
        updated = @dm_channel_user.update(active_2: true)
      end

      if updated
        render :show
      else
        render json: ["DM chatroom reactivation failed"]
      end
    else
      @channel = Channel.new(

      )
      @dm_channel_user = DmChannelUser.new(dm_channel_user_params)
      if @dm_channel_user.save
        render :show
      else
        render json: ["DM chatroom creation failed"]
      end
    end
  end

  # Will disable the current_user's active link
  def update
    @dm_channel_user = DmChannelUser.find_by(channel_id: dm_channel_user_params[:channel_id])
    if @dm_channel_user

      if @dm_channel_user.update(dm_channel_user_params)
        render :show
      else
        render json: ["DM chatroom toggle failed"], status: 401
      end
    else
      render json: ["DM chatroom not found!"], status: 401
    end
  end

  private
  def dm_channel_user_params
    params.require(:dm_channel_user).permit(
      :channel_id,
      :user_1_id, :active_1,
      :user_2_id, :active_2
    )
  end
end
