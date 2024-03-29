class Api::MessageReactsController < ApplicationController
  def create 
    @message_react = MessageReact.new(
      user_id: current_user.id,
      message_id: message_react_params[:message_id],
      react_code: message_react_params[:react_code],      
    )

    if @message_react.save
      render :show
    else
      render json: @message_react.errors.full_messages, status: 409
    end
  end

  def destroy
    @message_react = MessageReact.find_by(
      user_id: current_user.id,
      message_id: message_react_params[:message_id],
      react_code: message_react_params[:react_code]
    )
    
    if @message_react
      if @message_react.destroy
        render :show
      else
        render json: @message_react.errors.full_messages, status: 409
      end
    else
      render json: ["Delete failed: message react not found."], status: 404
    end
  end

  private
  def message_react_params
    params.require(:message_react).permit(:message_id, :react_code)
  end
end
