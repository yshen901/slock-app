class CreateChannels < ActiveRecord::Migration[5.2]
  def change
    create_table :channels do |t|
      t.string :name, null: false
      t.integer :workspace_id, null: false
      t.string :description, null: false
      t.boolean :starred, default: false

      t.timestamps
    end

    add_index :channels, [:name, :workspace_id], unique: true
    add_index :channels, :workspace_id
  end
end
