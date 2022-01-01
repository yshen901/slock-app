class AddUserTimezoneOffset < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :timezone_offset, :integer, default: 0
  end
end
