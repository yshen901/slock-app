class AddStarredToDmChannel < ActiveRecord::Migration[5.2]
  def change
    add_column :dm_channel_users, :starred_1, :boolean, default: false
    add_column :dm_channel_users, :starred_2, :boolean, default: false
  end
end
