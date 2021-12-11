class Api::ChannelsController < ApplicationController
  def index
    @channels = Channel
      .includes(:messages, :users, :dm_user_1, :dm_user_2)    # include user/messages to avoid N+1
      .where(workspace_id: params[:workspace_id])
    render 'api/channels/index'
  end

  def show
    @channel = Channel
      .includes(:messages, :users, :dm_user_1, :dm_user_2)  # include user/messages to avoid N+1
      .find_by_id(params[:id])
    if @channel
      render 'api/channels/show'
    else
      render json: ["Channel doesn't exist"], status: 401
    end
  end

  # DESIGN: This is designed to be passed an object containing the workspace_id
  #         Only activated by create channel
  def create
    @channel = Channel.new(channel_params)
    old_channel = Channel.find_by(channel_params)
    if old_channel
      render json: ["Channel name already exists"], status: 401
    elsif @channel.save
      ChannelUser.create(channel_id: @channel.id, user_id: current_user.id)
      @no_messages = true         # to tell partial to not load messages and only one user
      @single_user = current_user # this will help reduce the number of queries
      render 'api/channels/show'
    else
      render json: ["Other error occurred"], status: 401
    end
  end

  def update 
    @channel = Channel.includes(:messages).find_by_id(params[:id])
    if @channel.update(channel_params)
      render "api/channels/show"
    else
      render @channel.errors.full_messages, status: 401
    end
  end

  private

  def channel_params 
    params.require(:channel).permit(:name, :workspace_id, :description, :starred, :dm_channel)
  end
end
