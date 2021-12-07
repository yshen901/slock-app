class User < ApplicationRecord
  before_validation :ensure_session_token

  # TODO1: VALIDATION THAT REQUIRES EMAIL TO HAVE AN @
  validates :email, :password_digest, :session_token, presence: true
  validates :email, :session_token, uniqueness: true

  # MUST HAVE ALLOW_NIL OR IT WILL ALWAYS FAIL VALIDATION
  validates :password, length: { minimum: 6 }, allow_nil: true 

  # joins connection to a workspace, contains logged_in info
  has_many :connections,
    foreign_key: :user_id,
    class_name: :WorkspaceUser,
    dependent: :destroy

  # workspaces the user is a member of
  has_many :workspaces,
    through: :connections,
    source: :workspace

  # connection to a channel
  has_many :channel_connections,
    foreign_key: :user_id,
    class_name: :ChannelUser,
    dependent: :destroy

  # channels the user is in
  has_many :channels,
    through: :channel_connections,
    source: :channel

  # connection to dm channel
  has_many :dm_channel_connections_1,
    foreign_key: :user_1_id,
    class_name: :DmChannelUser,
    dependent: :destroy

  has_many :dm_channel_connections_2,
    foreign_key: :user_2_id,
    class_name: :DmChannelUser,
    dependent: :destroy

  # dm channels the user is in
  has_many :dm_channels_1,
    through: :dm_channel_connections_1,
    source: :channel

  has_many :dm_channels_2,
    through: :dm_channel_connections_2,
    source: :channel

  has_many :messages

  #AWS Photo
  has_one_attached :photo
  
  attr_reader :password

  # sets the password_digest
  def password=(password)
    @password = password;
    self.password_digest = BCrypt::Password.create(password)
  end

  # checks password against password_digest
  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end
  
  # makes sure the user has a session_token
  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64(16)
  end

  # resets the users session_token
  def reset_session_token 
    self.session_token = SecureRandom.urlsafe_base64(16)
    self.save
    self.session_token
  end

  # finds a user given their email and password
  def self.find_by_credentials(email, password)
    user = User.find_by_email(email)
    user && user.is_password?(password) ? user : nil
  end
end
