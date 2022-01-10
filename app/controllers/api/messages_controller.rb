class Api::MessagesController < ApplicationController
  def index 
    channel = Channel.includes(messages: [:message_reacts]).find_by_id(params[:channel_id]);
    @messages = channel.messages;
    render "api/messages/index"
  end

  def update
    @message = Message.find(params[:id])
    if @message.update(message_params)
      render :show
    else
      render json: @message.errors.full_messages, status: 402
    end
  end

  private
  def message_params
    params.require(:message).permit(:body)
  end
end
