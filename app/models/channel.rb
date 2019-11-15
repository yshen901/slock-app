class Channel < ApplicationRecord
  validates :name, :workspace_id, presence: true
  validates :starred, inclusion: { in: [ true, false ] }

  # the workspace the channel belongs to
  belongs_to :workspace

  # connection to a user
  has_many :channel_connections,
    foreign_key: :channel_id,
    class_name: :ChannelUser,
    dependent: :destroy

  # users in the channel
  has_many :users,
    through: :channel_connections,
    source: :user

  has_many :messages,
    dependent: :destroy
end
