class CreateWorkspaces < ActiveRecord::Migration[5.2]
  def change
    create_table :workspaces do |t|
      t.string :address, null: false
      t.timestamps
    end

    add_index :workspaces, :address, unique: true
  end
end
