class Api::ChannelsController < ApplicationController
  def index
    @channels = Channel
      .includes(:messages, :dm_user_1, :dm_user_2, :connections)    # include user/messages to avoid N+1
      .where(workspace_id: params[:workspace_id])
    render 'api/channels/index'
  end

  def show
    @channel = Channel
      .includes(:messages, :dm_user_1, :dm_user_2, :connections)  # include user/messages to avoid N+1
      .find_by_id(params[:id])
    if @channel
      render 'api/channels/show'
    else
      render json: ["Channel doesn't exist"], status: 404
    end
  end

  # DESIGN: This is designed to be passed an object containing the workspace_id
  #         Only activated by create channel
  def create
    @channel = Channel.new(channel_params)
    old_channel = Channel.find_by(channel_params)
    if old_channel
      render json: ["Channel name already exists"], status: 409
    elsif @channel.save
      @single_channel_connection = ChannelUser.create(channel_id: @channel.id, user_id: current_user.id)
      @no_messages = true         # to tell partial to not load messages and only one user
      render 'api/channels/show'
    else
      render json: ["Other error occurred"], status: 409
    end
  end

  def update 
    @channel = Channel.find_by_id(params[:id])
    if @channel.update(channel_params)
      render "api/channels/show"
    else
      render @channel.errors.full_messages, status: 401
    end
  end

  private

  def channel_params 
    params.require(:channel).permit(:name, :workspace_id, :description, :topic, :dm_channel)
  end
end
