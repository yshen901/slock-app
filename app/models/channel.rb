class Channel < ApplicationRecord
  validates :name, :workspace_id, presence: true
  validates :starred, inclusion: { in: [ true, false ] }
  validates :dm_channel, inclusion: { in: [ true, false ]}
  before_save :check_defaults

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
  
  
  
  # connection
  has_one :dm_channel_connections,
    foreign_key: :channel_id,
    class_name: :DmChannelUser,
    dependent: :destroy

  # dm users in the channel
  has_one :dm_user_1,
    through: :dm_channel_connections,
    source: :user_1
  has_one :dm_user_2,
    through: :dm_channel_connections,
    source: :user_2

  def dm_users
    dm_user_1.merge(dm_user_2)
  end

  def check_defaults
    self.description ||= ""
  end
end
