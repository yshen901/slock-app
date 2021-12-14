class MakeDmChannelUserDefaultInactive < ActiveRecord::Migration[5.2]
  def change
    remove_column :dm_channel_users, :active_1
    remove_column :dm_channel_users, :active_2

    add_column :dm_channel_users, :active_1, :boolean, default: false
    add_column :dm_channel_users, :active_2, :boolean, default: false
  end
end
