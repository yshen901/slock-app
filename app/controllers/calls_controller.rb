class CallsController < ApplicationController
  def create
    head :no_content
    ActionCable.server.broadcast("call_channel", {
      type: call_params[:type],
      from: call_params[:from],
      to: call_params[:to],
      stp: call_params[:stp],
    })
  end

  private
  def call_params
    params.permit(:call, :type, :from, :to, :stp)
  end
end