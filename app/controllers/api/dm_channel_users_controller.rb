class Api::DmChannelUsersController < ApplicationController
  def create
    # Find the connection using the user_ids
    @dm_channel_user = DmChannelUser.includes(:channel).where(
      "
        (user_1_id = #{dm_channel_user_params[:user_1_id]} AND user_2_id = #{dm_channel_user_params[:user_2_id]})
        OR
        (user_1_id = #{dm_channel_user_params[:user_2_id]} AND user_2_id = #{dm_channel_user_params[:user_1_id]})
      "
    ).first;

    # If connection is found, reactivate the right user
    # If connection isn't found, make the connection and the channel
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
        workspace_id: dm_channel_user_params[:workspace_id],
        name: "#{dm_channel_user_params[:user_1_id]}-#{dm_channel_user_params[:user_2_id]}",
        dm_channel: true
      )
      if @channel.save 
        @dm_channel_user = DmChannelUser.new(dm_channel_user_params)
        @dm_channel_user.channel_id = @channel.id

        # Sets the active link of the current user, aka the channel starter, to true
        if (@dm_channel_user.user_1_id == current_user.id)
          @dm_channel_user.active_1 = true
        else
          @dm_channel_user.active_2 = true
        end

        if @dm_channel_user.save
          render :show
        else
          render json: ["Failed to create link to DMChannel."]
        end
      else
        render json: ["Failed to create DMChannel."]
      end
    end
  end

  # Will disable/enable the current_user's active link to the channel
  # Will also update the starred status
  def update
    @dm_channel_user = DmChannelUser.includes(:channel).find_by(channel_id: dm_channel_user_params[:channel_id])

    update_active = {};
    if current_user.id == @dm_channel_user.user_1_id
      update_active[:active_1] = dm_channel_user_params[:active]
      update_active[:starred_1] = dm_channel_user_params[:starred] if dm_channel_user_params.has_key?(:starred)
    elsif current_user.id == @dm_channel_user.user_2_id
      update_active[:active_2] = dm_channel_user_params[:active]
      update_active[:starred_2] = dm_channel_user_params[:starred] if dm_channel_user_params.has_key?(:starred)
    end

    if @dm_channel_user
      if @dm_channel_user.update(update_active)
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
      :channel_id, :workspace_id,
      :user_1_id, :active_1,
      :user_2_id, :active_2,
      :active, :starred
    )
  end
end
