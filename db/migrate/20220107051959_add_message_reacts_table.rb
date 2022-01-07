class AddMessageReactsTable < ActiveRecord::Migration[5.2]
  def change
    create_table :message_reacts do |t|
      t.integer :user_id, null: false
      t.integer :message_id, null: false
      t.string :react_code, null: false
      
      t.timestamps
    end

    add_index :message_reacts, :user_id
    add_index :message_reacts, :message_id
  end
end
