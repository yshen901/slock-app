class AddChannelTopic < ActiveRecord::Migration[5.2]
  def change
    add_column :channels, :topic, :string, null: false
  end
end
