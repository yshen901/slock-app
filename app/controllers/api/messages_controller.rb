class Api::MessagesController < ApplicationController
  def index 
    channel = Channel.find_by_id(params[:channel_id]);
    @messages = channel.messages;
    render "api/messages/index"
  end
end
