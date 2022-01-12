class Api::MessagesController < ApplicationController
  def index 
    @messages = Message.includes(:message_reacts).where(channel_id: params[:channel_id]).with_attached_files
    render "api/messages/index"
  end

  def create
    @message = Message.new({
      user_id: current_user.id,
      channel_id: message_params[:channel_id],
      body: message_params[:body]
    })

    if @message.save
      render :show
    else
      render json: @message.errors.full_messages, status: 409
    end
  end

  def destroy
    @message = Message.find_by(id: params[:id])
    if @message
      if @message.destroy
        render :show
      else
        render json: ["Message destroy failed."], status: 409
      end
    else
      render json: ["Message not found."], status: 404
    end
  end

  def update
    @message = Message.find_by(id: params[:id])
    if @message.update(message_params)
      render :show
    else
      render json: @message.errors.full_messages, status: 409
    end
  end

  private
  def message_params
    params.require(:message).permit(:body, :channel_id, files: [])
  end
end
