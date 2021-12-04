class Message < ApplicationRecord
  validates :user_id, :channel_id, :body, presence: true

  belongs_to :user
  belongs_to :channel
end
