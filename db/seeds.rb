# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create(email: "demo1@slock.com", password: "password")
User.create(email: "demo2@slock.com", password: "password")

Workspace.create(address: 'slock')

WorkspaceUser.create(user_id: 1, workspace_id: 1)
WorkspaceUser.create(user_id: 2, workspace_id: 1)

Channel.create(name: "general", workspace_id: 1)
Channel.create(name: "customer-support", workspace_id: 1)
Channel.create(name: "information", workspace_id: 1)

ChannelUser.create(user_id: 1, channel_id: 1)
ChannelUser.create(user_id: 1, channel_id: 2)
ChannelUser.create(user_id: 1, channel_id: 3)

ChannelUser.create(user_id: 2, channel_id: 1)
ChannelUser.create(user_id: 2, channel_id: 2)
ChannelUser.create(user_id: 2, channel_id: 3)