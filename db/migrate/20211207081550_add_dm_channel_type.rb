class AddDmChannelType < ActiveRecord::Migration[5.2]
  def change
    add_column :channels, :dm_channel, :boolean, default: false

    remove_index :channels, [:name, :workspace_id]
    add_index :channels, [:name, :workspace_id, :dm_channel], unique: true
  end
end
