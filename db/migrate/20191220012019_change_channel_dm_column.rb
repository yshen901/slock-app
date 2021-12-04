class ChangeChannelDmColumn < ActiveRecord::Migration[5.2]
  def change
    remove_column :channels, :type
    add_column :channels, :channel_type, :string, default: "channel"
  end
end
