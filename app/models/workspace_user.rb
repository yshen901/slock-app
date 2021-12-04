class WorkspaceUser < ApplicationRecord
  validates :user_id, :workspace_id, presence: true
  validates :logged_in, inclusion: { in: [true, false] }

  belongs_to :user
  belongs_to :workspace

  # logs in the user
  def login!
    self.logged_in = true;
    self.save
  end

  # logs out the user
  def logout!
    self.logged_in = false;
    self.save
  end
end
