class Api::ChannelsController < ApplicationController
  def index
    @channels = Channel.where(workspace_id: params[:workspace_id])
    render 'api/channels/index'
  end

  def show
    @channel = Channel.find_by_id(params[:id])
    if @channel
      render 'api/channels/show'
    else
      render json: ["Channel doesn't exist"], status: 401
    end
  end

  # DESIGN: This is designed to be passed an object containing the workspace_id
  def create
    @channel = Channel.new(channel_params)
    old_channel = Channel.find_by(channel_params)
    if old_channel
      render json: ["Channel name already exists"], status: 401
    elsif @channel.save
      ChannelUser.create(channel_id: @channel.id, user_id: current_user.id)
      render 'api/channels/show'
    else
      render json: ["Other error occurred"], status: 401
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
    params.require(:channel).permit(:name, :workspace_id, :description, :starred, :dm_channel)
  end
end
