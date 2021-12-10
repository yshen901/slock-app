class AddWorkspaceIdToChannelConnection < ActiveRecord::Migration[5.2]
  def change
    add_column :channel_users, :workspace_id, :integer, null: false
    add_column :dm_channel_users, :workspace_id, :integer, null: false
  end
end
