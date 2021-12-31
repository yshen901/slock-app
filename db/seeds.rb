# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

boromir = User.create(email: "boromir@slock.com", password: "zunera", display_name: "Boromir", full_name: "Boromir of Gondor", what_i_do: "Captain of the White Tower")
file = File.open("app/assets/images/boromir.jpg")
# boromir.photo.attach({io: file, filename: "boromir.jpg"})

gandalf = User.create(email: "gandalf@slock.com", password: "zunera", display_name: "Gandalf", full_name: "Gandalf the Grey", what_i_do: "Istar")
file = File.open("app/assets/images/gandalf.png")
# gandalf.photo.attach({io: file, filename: "gandalf.png"})

legolas = User.create(email: "legolas@slock.com", password: "zunera", display_name: "Legolas", full_name: "Legolas Greenleaf", what_i_do: "Prince of the Woodland Realm")
file = File.open("app/assets/images/legolas.jpg")
# legolas.photo.attach({io: file, filename: "legolas.jpg"})

gimli = User.create(email: "gimli@slock.com", password: "zunera", display_name: "Gimli", full_name: "Gimli, son of Gloin", what_i_do: "Lord of the Glittering Caves")
file = File.open("app/assets/images/gimli.png")
# gimli.photo.attach({io: file, filename: "gimli.png"})

frodo = User.create(email: "frodo@slock.com", password: "zunera", display_name: "Frodo", full_name: "Frodo Baggins", what_i_do: "Bearer of the One Ring")
file = File.open("app/assets/images/frodo.jpg")
# frodo.photo.attach({io: file, filename: "frodo.jpg"})

aragorn = User.create(email: "aragorn@slock.com", password: "zunera", display_name: "Aragorn", full_name: "Aragorn II Elessar", what_i_do: "King of Gondor")
file = File.open("app/assets/images/aragorn.jpg")
# aragorn.photo.attach({io: file, filename: "aragorn.jpg"})

demo_user = User.create(email: "demoUser@slock.com", password: "demoPassword", display_name: "Demo User", full_name: "Demo User", what_i_do: "Website Tester")

my_user = User.create(email: "shen.yuci1@gmail.com", password: "zunera", display_name: "Yuci", full_name: "Yuci Shen", what_i_do: "Software Engineer/Fullstack Developer", phone_number: "4083167173")
demo_workspace = Workspace.create(address: 'Demo Workspace')
general_channel = Channel.create({name: "general", workspace_id: demo_workspace.id, description: "For general discussion. Please refer to other channels for more interesting topics.", topic: "General discussion."})
random_channel = Channel.create({name: "random", workspace_id: demo_workspace.id, description: "For all off topic discussion.", topic: "Talk about anything!"})
channel_1 = Channel.create(name: "council-of-elrond", workspace_id: demo_workspace.id, description: "Elrond's council in Rivendell.", topic: "What to do about the One Ring.")
channel_2 = Channel.create(name: "customer-support", workspace_id: demo_workspace.id, description: "A channel dedicated to technical issues you experience while using Slock.", topic: "Debugging and troubleshooting.")
channel_3 = Channel.create(name: "information", workspace_id: demo_workspace.id, description: "A channel dedicated to questions you have for either me or the app itself.", topic: "Ask me anything about myself, Slock, or my projects!")
channel_4 = Channel.create(name: "test-channel-1", workspace_id: demo_workspace.id, description: "Test Channel 1")
channel_5 = Channel.create(name: "test-channel-2", workspace_id: demo_workspace.id, description: "Test Channel 2")
channel_6 = Channel.create(name: "test-channel-3", workspace_id: demo_workspace.id, description: "Test Channel 3")

dm_channel = Channel.create(name: "#{demo_user.id}-#{my_user.id}", workspace_id: demo_workspace.id, dm_channel: true)
dm_channel_user = DmChannelUser.create(user_1_id: demo_user.id, user_2_id: my_user.id, channel_id: dm_channel.id, workspace_id: demo_workspace.id);

dm_channel = Channel.create(name: "#{demo_user.id}-#{gandalf.id}", workspace_id: demo_workspace.id, dm_channel: true)
dm_channel_user = DmChannelUser.create(user_1_id: demo_user.id, user_2_id: gandalf.id, channel_id: dm_channel.id, workspace_id: demo_workspace.id);

dm_channel = Channel.create(name: "#{demo_user.id}-#{frodo.id}", workspace_id: demo_workspace.id, dm_channel: true)
dm_channel_user = DmChannelUser.create(user_1_id: demo_user.id, user_2_id: frodo.id, channel_id: dm_channel.id, workspace_id: demo_workspace.id);

User.all.each do |user|
  logged_in = false
  if user == my_user || user == frodo || user == aragorn
    logged_in = true
  end
  
  WorkspaceUser.create(user_id: user.id, workspace_id: demo_workspace.id, logged_in: logged_in)
  ChannelUser.create(user_id: user.id, channel_id: channel_1.id, workspace_id: demo_workspace.id)
  ChannelUser.create(user_id: user.id, channel_id: channel_2.id, workspace_id: demo_workspace.id)
  ChannelUser.create(user_id: user.id, channel_id: channel_3.id, workspace_id: demo_workspace.id)
  ChannelUser.create(channel_id: general_channel.id, user_id: user.id, workspace_id: demo_workspace.id)
  ChannelUser.create(channel_id: random_channel.id, user_id: user.id, workspace_id: demo_workspace.id)
end

# Dummy workspace to test multiple workspace
test_workspace = Workspace.create(address: "test")
general_channel = Channel.create({name: "general", workspace_id: test_workspace.id})
random_channel = Channel.create({name: "random", workspace_id: test_workspace.id})
WorkspaceUser.create(user_id: demo_user.id, workspace_id: test_workspace.id)
ChannelUser.create(channel_id: general_channel.id, user_id: demo_user.id, workspace_id: test_workspace.id)
ChannelUser.create(channel_id: random_channel.id, user_id: demo_user.id, workspace_id: test_workspace.id)

Message.create(
  user_id: boromir.id, 
  channel_id: channel_1.id, 
  body: "One does not simply walk into Mordor.  Its black gates are guarded by more than just orcs. There is evil there that does not sleep and the great eye is ever watchful.  Tis a barren wasteland, riddled with fire and ash and dust.  The very air you breathe is a poisonous fume.  Not with ten thousand men could you do this. It is folly..."
);
Message.create(
  user_id: legolas.id, 
  channel_id: channel_1.id, 
  body: "Have you heard nothing Lord Elrond has said? The Ring must be destroyed!"
);
Message.create(
  user_id: gimli.id, 
  channel_id: channel_1.id, 
  body: "and I suppose you think you're the one to do it."
);

Message.create(
  user_id: boromir.id, 
  channel_id: channel_1.id, 
  body: "And if we fail, what then?"
);

Message.create(
  user_id: boromir.id, 
  channel_id: channel_1.id, 
  body: "What happens when Sauron takes back what is his?"
);

Message.create(
  user_id: gimli.id, 
  channel_id: channel_1.id, 
  body: "I will be dead before I see the Ring in the hands of an elf."
);

Message.create(
  user_id: gimli.id, 
  channel_id: channel_1.id, 
  body: "Never trust an elf!"
);

Message.create(
  user_id: gandalf.id, 
  channel_id: channel_1.id, 
  body: "Do you not understand that while we bicker amongst ourselves, Sauron's power grows?! None can escape it! You'll all be destroyed!"
);

Message.create(
  user_id: frodo.id, 
  channel_id: channel_1.id, 
  body: "I will take it!"
);

Message.create(
  user_id: frodo.id, 
  channel_id: channel_1.id, 
  body: "I will take it! I will take the Ring to Mordor. Tho, I do not know the way"
);

Message.create(
  user_id: gandalf.id, 
  channel_id: channel_1.id, 
  body: "I will help you bear this burden Frodo Baggins, as long as it is yours to bear."
);

Message.create(
  user_id: aragorn.id, 
  channel_id: channel_1.id, 
  body: "If by my life or death I can protect you, I will. You have my sword"
);

Message.create(
  user_id: legolas.id, 
  channel_id: channel_1.id, 
  body: "and you have my bow."
);

Message.create(
  user_id: gimli.id, 
  channel_id: channel_1.id, 
  body: "and my axe."
);

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "You carry the fate of us all little one. If this is indeed the will of the Council, then Gondor will see it done."
)