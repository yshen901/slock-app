class Channel < ApplicationRecord
  validates :name, :workspace_id, presence: true

  # the workspace the channel belongs to
  belongs_to :workspace
end
