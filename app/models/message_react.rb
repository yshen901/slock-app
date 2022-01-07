class MessageReact < ApplicationRecord
  validates :message_id, :user_id, :react_code, presence: true

  belongs_to :user
  belongs_to :message
end
