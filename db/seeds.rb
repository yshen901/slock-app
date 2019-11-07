# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Workspace.create(address: 'slack')
User.create(email: "asdf", password: "asdfasdf")

WorkspaceUser.create(user_id: 1, workspace_id: 1)

Channel.create(name: "Home", workspace_id: 1)
Channel.create(name: "Customer Support", workspace_id: 1)
Channel.create(name: "Community", workspace_id: 1)