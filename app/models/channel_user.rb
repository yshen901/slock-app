class ChannelUser < ApplicationRecord
  validates :user_id, :channel_id, :workspace_id, presence: true
  validates :starred, inclusion: { in: [ true, false ] }

  belongs_to :user
  belongs_to :channel
end
