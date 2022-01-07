class MessageSave < ApplicationRecord
  validates :user_id, :message_id, :workspace_id, presence: true
  validates :user_id, uniqueness: { scope: :message_id }

  belongs_to :user
  belongs_to :message
end
