class ChannelUser < ApplicationRecord
  validates :user_id, :channel_id, :workspace_id, presence: true

  belongs_to :user
  belongs_to :channel
end
