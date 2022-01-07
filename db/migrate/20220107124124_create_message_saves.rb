class CreateMessageSaves < ActiveRecord::Migration[5.2]
  def change
    create_table :message_saves do |t|
      t.integer :user_id, null: false
      t.integer :message_id, null: false

      t.timestamps
    end

    add_index :message_saves, :user_id
    add_index :message_saves, :message_id
    add_index :message_saves, [:user_id, :message_id], unique: true
  end
end
