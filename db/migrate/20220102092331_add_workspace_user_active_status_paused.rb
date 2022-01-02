class AddWorkspaceUserActiveStatusPaused < ActiveRecord::Migration[5.2]
  def change
    add_column :workspace_users, :active, :boolean, default: true
    add_column :workspace_users, :paused, :boolean, default: false
    add_column :workspace_users, :status, :string, default: ""
  end
end
