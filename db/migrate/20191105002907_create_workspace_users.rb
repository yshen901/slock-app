class CreateWorkspaceUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :workspace_users do |t|
      t.bigint :user_id, null: false
      t.bigint :workspace_id, null: false
      t.boolean :logged_in, default: false
      t.timestamps
    end

    add_index :workspace_users, [:user_id, :workspace_id], unique: true
  end
end
