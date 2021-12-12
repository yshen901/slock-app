class AddUserInformation < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :full_name, :string, null: false
    add_column :users, :display_name, :string, null: false
    add_column :users, :phone_number, :string, null: false
    add_column :users, :what_i_do, :string, null: false
  end
end
