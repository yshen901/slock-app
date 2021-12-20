class AddActiveToChannelUser < ActiveRecord::Migration[5.2]
  def change
    add_column :channel_users, :active, :boolean, default: true
  end
end
