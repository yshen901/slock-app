class CreateDmChannelUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :dm_channel_users do |t|
      t.integer :channel_id, null: false
      t.integer :user_1_id, null: false
      t.integer :user_2_id, null: false
      t.boolean :active_1, default: true
      t.boolean :active_2, default: true
      t.timestamps
    end

    # each channel can only be used once
    add_index :dm_channel_users, :channel_id, unique: true

    # each user pair can only have one connection
    add_index :dm_channel_users, [:user_1_id, :user_2_id], unique: true

    add_index :dm_channel_users, :user_1_id
    add_index :dm_channel_users, :user_2_id
  end
end
