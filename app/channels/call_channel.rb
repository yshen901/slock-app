#AC
class CallChannel < ApplicationCable::Channel
  def subscribed
    stream_for "call_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
