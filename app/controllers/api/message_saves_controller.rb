class Api::MessageSavesController < ApplicationController
  def index
    @message_saves = MessageSave.includes(:message).where(
      user_id: current_user.id,
      workspace_id: message_save_params[:workspace_id]
    )
    render :index
  end

  def create
    @message_save = MessageSave.new(
      user_id: current_user.id, 
      message_id: message_save_params[:message_id],
      workspace_id: message_save_params[:workspace_id]
    )
    if @message_save.save 
      render :show
    else
      render json: @message_save.errors.full_messages, status: 409
    end
  end

  def destroy
    @message_save = MessageSave.find_by(
      user_id: current_user.id, 
      message_id: message_save_params[:message_id]
    )
    if @message_save
      if @message_save.destroy 
        render :show
      else
        render json: @message_save.errors.full_messages, status: 409
      end
    else 
      render json: ["Message save not found."], status: 404
    end
  end

  private
  def message_save_params
    params.require(:message_save).permit(:message_id, :workspace_id)
  end
end
