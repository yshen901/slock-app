class MoveStarredTagToConnection < ActiveRecord::Migration[5.2]
  def change
    remove_column :channels, :starred
    add_column :channel_users, :starred, :boolean, default: false
  end
end
