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

Channel.create(name: "general", workspace_id: 1, description: "This is the homepage", starred: true)
Channel.create(name: "customer-support", workspace_id: 1, description: "Please let us know if you need help", starred: false)
Channel.create(name: "information", workspace_id: 1, description: "For any questions you might have for me", starred: false)

ChannelUser.create(user_id: 1, channel_id: 1)
ChannelUser.create(user_id: 1, channel_id: 2)
ChannelUser.create(user_id: 1, channel_id: 3)

ChannelUser.create(user_id: 2, channel_id: 1)
ChannelUser.create(user_id: 2, channel_id: 2)
ChannelUser.create(user_id: 2, channel_id: 3)

Message.create(user_id: 1, channel_id: 1, body: "message 1");
Message.create(user_id: 1, channel_id: 1, body: "message 2");
Message.create(user_id: 1, channel_id: 1, body: "message 3");