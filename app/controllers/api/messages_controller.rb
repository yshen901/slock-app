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
      if message_params[:files]
        @message.files.attach(message_params[:files])
      end
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
    if message_params[:deleted_file_id]
      @message.files.find(message_params[:deleted_file_id]).purge
      render :show
    elsif @message.update(message_params)
      render :show
    else
      render json: @message.errors.full_messages, status: 409
    end
  end

  private
  def message_params
    params.require(:message).permit(:body, :channel_id, :deleted_file_id, files: [])
  end
end
