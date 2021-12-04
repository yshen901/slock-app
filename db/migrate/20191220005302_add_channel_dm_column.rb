class AddChannelDmColumn < ActiveRecord::Migration[5.2]
  def change
    add_column :channels, :type, :string, default: "channel"
  end
end
