#AC
require 'json'
class CallChannel < ApplicationCable::Channel
  def subscribed
    stream_for "call_channel"
  end


  def speak(data)
    CallChannel.broadcast_to('call_channel', data)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
