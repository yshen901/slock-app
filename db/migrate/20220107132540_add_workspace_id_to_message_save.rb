class AddWorkspaceIdToMessageSave < ActiveRecord::Migration[5.2]
  def change
    add_column :message_saves, :workspace_id, :integer, null: false
  end
end
