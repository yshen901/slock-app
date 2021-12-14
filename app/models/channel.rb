class Channel < ApplicationRecord
  validates :name, :workspace_id, presence: true
  # validates :starred, inclusion: { in: [ true, false ] }
  validates :dm_channel, inclusion: { in: [ true, false ]}
  before_save :ensure_defaults

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
  has_one :dm_channel_connection,
    foreign_key: :channel_id,
    class_name: :DmChannelUser,
    dependent: :destroy

  # dm users in the channel
  has_one :dm_user_1,
    through: :dm_channel_connection,
    source: :user_1
  has_one :dm_user_2,
    through: :dm_channel_connection,
    source: :user_2

  def dm_users
    dm_user_1.merge(dm_user_2)
  end

  def ensure_defaults
    self.description ||= ""
  end
end
