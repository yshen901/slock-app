class Api::MessagesController < ApplicationController
  def index 
    channel = Channel.includes(messages: [:message_reacts]).find_by_id(params[:channel_id]);
    @messages = channel.messages;
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
      render json: @message.errors.full_messages, status: 402
    end
  end

  def destroy
    @message = Message.find_by(id: params[:id])
    if @message
      if @message.destroy
        render :show
      else
        render json: ["Message destroy failed."], status: 402
      end
    else
      render json: ["Message not found."], status: 400
    end
  end

  def update
    @message = Message.find_by(id: params[:id])
    if @message.update(message_params)
      render :show
    else
      render json: @message.errors.full_messages, status: 402
    end
  end

  private
  def message_params
    params.require(:message).permit(:body, :channel_id)
  end
end
