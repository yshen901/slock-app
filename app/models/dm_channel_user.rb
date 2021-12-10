class DmChannelUser < ApplicationRecord
  validates :channel_id, :user_1_id, :user_2_id, :workspace_id, presence: true
  validates :active_1, :active_2, inclusion: { in: [ true, false ] }

  belongs_to :channel

  belongs_to :user_1,
    class_name: :User

  belongs_to :user_2,
    class_name: :User
end