class Workspace < ApplicationRecord
  validates :address, presence: true, uniqueness: true

  # the joins connection to the user, contains logged_in info
  has_many :connections,
    foreign_key: :workspace_id,
    class_name: :WorkspaceUser,
    dependent: :destroy

  # the channels under this workspace  
  has_many :channels,
    dependent: :destroy
    
  # the users the workspace has
  has_many :users,
    through: :connections,
    source: :user

  def address=(address) 
    new_address = address.split(" ").map{ |word| word.downcase }
    @address = new_address.join('-')
    super(new_address.join('-'))
  end
end
