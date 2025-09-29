# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
yuci = User.create(email: "shen.yuci1@gmail.com", password: "zunera", display_name: "Yuci", full_name: "Yuci Shen", what_i_do: "Software Engineer/Fullstack Developer", phone_number: "4083167173")

elrond = User.create(email: "elrond@slock.com", password: "zunera", display_name: "Elrond", full_name: "Boromir Peredhel", what_i_do: "Lord of Rivendell")
# file = File.open("app/assets/images/elrond.jpg")
# elrond.photo.attach({io: file, filename: "elrond.jpg"})

boromir = User.create(email: "boromir@slock.com", password: "zunera", display_name: "Boromir", full_name: "Boromir of Gondor", what_i_do: "Captain of the White Tower")
# file = File.open("app/assets/images/boromir.jpg")
# boromir.photo.attach({io: file, filename: "boromir.jpg"})

gandalf = User.create(email: "gandalf@slock.com", password: "zunera", display_name: "Gandalf", full_name: "Gandalf the Grey", what_i_do: "Istar")
# file = File.open("app/assets/images/gandalf.png")
# gandalf.photo.attach({io: file, filename: "gandalf.png"})

legolas = User.create(email: "legolas@slock.com", password: "zunera", display_name: "Legolas", full_name: "Legolas Greenleaf", what_i_do: "Prince of the Woodland Realm")
# file = File.open("app/assets/images/legolas.jpg")
# legolas.photo.attach({io: file, filename: "legolas.jpg"})

gimli = User.create(email: "gimli@slock.com", password: "zunera", display_name: "Gimli", full_name: "Gimli, son of Gloin", what_i_do: "Lord of the Glittering Caves")
# file = File.open("app/assets/images/gimli.png")
# gimli.photo.attach({io: file, filename: "gimli.png"})

frodo = User.create(email: "frodo@slock.com", password: "zunera", display_name: "Frodo", full_name: "Frodo Baggins", what_i_do: "Bearer of the One Ring")
# file = File.open("app/assets/images/frodo.jpg")
# frodo.photo.attach({io: file, filename: "frodo.jpg"})

aragorn = User.create(email: "aragorn@slock.com", password: "zunera", display_name: "Aragorn", full_name: "Aragorn II Elessar", what_i_do: "King of Gondor")
# file = File.open("app/assets/images/aragorn.jpg")
# aragorn.photo.attach({io: file, filename: "aragorn.jpg"})

sam = User.create(email: "sam@slock.com", password: "zunera", display_name: "Sam", full_name: "Samwise Gamgee", what_i_do: "Mayor of Michel Delving")
# file = File.open("app/assets/images/sam.jpeg")
# sam.photo.attach({io: file, filename: "sam.jpg"})

merry = User.create(email: "merry@slock.com", password: "zunera", display_name: "Merry", full_name: "Meriadoc Brandybuck", what_i_do: "Master of Buckland")
# file = File.open("app/assets/images/merry.jpg")
# merry.photo.attach({io: file, filename: "merry.jpg"})

pippin = User.create(email: "pippin@slock.com", password: "zunera", display_name: "Pippin", full_name: "Peregrin Took", what_i_do: "Thain of the Shire")
# file = File.open("app/assets/images/pippin.jpg")
# pippin.photo.attach({io: file, filename: "pippin.jpg"})

demo_user = User.create(email: "demoUser@slock.com", password: "demoPassword", display_name: "Demo User", what_i_do: "Website Tester")

# Dummy workspace to test multiple workspace
test_workspace = Workspace.create(address: "test")
general_channel = Channel.create({name: "general", workspace_id: test_workspace.id})
random_channel = Channel.create({name: "random", workspace_id: test_workspace.id})
WorkspaceUser.create(user_id: demo_user.id, workspace_id: test_workspace.id, logged_in: true)
ChannelUser.create(channel_id: general_channel.id, user_id: demo_user.id, workspace_id: test_workspace.id)
ChannelUser.create(channel_id: random_channel.id, user_id: demo_user.id, workspace_id: test_workspace.id)

# Main workspace where all of our demos will lie
demo_workspace = Workspace.create(address: 'Demo Workspace')
general_channel = Channel.create({name: "general", workspace_id: demo_workspace.id, description: "For general discussion. Please refer to other channels for more interesting topics.", topic: "General discussion."})
random_channel = Channel.create({name: "random", workspace_id: demo_workspace.id, description: "For all off topic discussion.", topic: "Talk about anything!"})
channel_1 = Channel.create(name: "council-of-elrond", workspace_id: demo_workspace.id, description: "Elrond's council in Rivendell.", topic: "What to do about the One Ring.")
channel_2 = Channel.create(name: "customer-support", workspace_id: demo_workspace.id, description: "A channel dedicated to technical issues you experience while using Slock.", topic: "Debugging and troubleshooting.")
channel_3 = Channel.create(name: "information", workspace_id: demo_workspace.id, description: "A channel dedicated to questions you have for either me or the app itself.", topic: "Ask me anything about myself, Slock, or my projects!")

dm_channel = Channel.create(name: "#{demo_user.id}-#{yuci.id}", workspace_id: demo_workspace.id, dm_channel: true)
dm_channel_user = DmChannelUser.create(user_1_id: demo_user.id, user_2_id: yuci.id, channel_id: dm_channel.id, workspace_id: demo_workspace.id, active_1: true, active_2: true)

dm_channel = Channel.create(name: "#{demo_user.id}-#{gandalf.id}", workspace_id: demo_workspace.id, dm_channel: true)
dm_channel_user = DmChannelUser.create(user_1_id: demo_user.id, user_2_id: gandalf.id, channel_id: dm_channel.id, workspace_id: demo_workspace.id, active_1: true, active_2: true)

dm_channel = Channel.create(name: "#{demo_user.id}-#{frodo.id}", workspace_id: demo_workspace.id, dm_channel: true)
dm_channel_user = DmChannelUser.create(user_1_id: demo_user.id, user_2_id: frodo.id, channel_id: dm_channel.id, workspace_id: demo_workspace.id, active_1: true, active_2: true)

User.all.each do |user|
  logged_in = false
  if user == yuci || user == gandalf || user == aragorn
    logged_in = true
  end
  
  WorkspaceUser.create(user_id: user.id, workspace_id: demo_workspace.id, logged_in: logged_in)
  ChannelUser.create(user_id: user.id, channel_id: channel_1.id, workspace_id: demo_workspace.id)
  ChannelUser.create(channel_id: general_channel.id, user_id: user.id, workspace_id: demo_workspace.id)
  ChannelUser.create(channel_id: random_channel.id, user_id: user.id, workspace_id: demo_workspace.id)
end

# Seed data for LOTRO channel
Message.create(
  user_id: elrond.id,
  channel_id: channel_1.id,
  body: "	Strangers from distant lands, friends of old. You have been summoned here to answer the threat of Mordor. Middle Earth stands upon the brink of destruction. None can escape it. You will unite or you will fall. Each race is bound to this fate, this one doom."
)

Message.create(
  user_id: elrond.id,
  channel_id: channel_1.id,
  body: "Bring forth the Ring, Frodo."
)

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "So it's true."
)

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "	In a dream...I saw the Eastern sky grow dark."
)

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "In the West a pale light lingered A voice was crying, your doom is near at hand."
)

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "Isildur's bane is found...Isildur's Bane."
)

Message.create(
  user_id: elrond.id,
  channel_id: channel_1.id,
  body: "Boromir!"
)

Message.create(
  user_id: gandalf.id,
  channel_id: channel_1.id,
  body: "Ash nazg durbatulk, ash nazg gimbatul, ash nazg thrakatulk, agh burzum-ishi krimpatul."
)

Message.create(
  user_id: elrond.id,
  channel_id: channel_1.id,
  body: "Never before has anyone uttered words of that tongue here in Imladris."
)

Message.create(
  user_id: gandalf.id,
  channel_id: channel_1.id,
  body: "	I do not ask your pardon Master Elrond for the Black Speech of Mordor may yet be heard in every corner of the West."
)

Message.create(
  user_id: gandalf.id,
  channel_id: channel_1.id,
  body: "The Ring is altogether evil."
)

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "Aye it is a gift!"
)

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "A gift to the foes of Mordor. Why not use this Ring?"
)

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "Long has my father, the Steward of Gondor kept the forces of Mordor at bey. By the blood of our people are your lands kept safe."
)

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "Give Gondor the weapon of the enemy, let us use it against him!"
)

Message.create(
  user_id: aragorn.id,
  channel_id: channel_1.id,
  body: "You cannot wield it. None of us can."
)

Message.create(
  user_id: aragorn.id,
  channel_id: channel_1.id,
  body: "The One Ring answers to Sauron alone. It has no other master."
)

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "and what would a ranger know of this matter?"
)

Message.create(
  user_id: legolas.id,
  channel_id: channel_1.id,
  body: "This is no mere Ranger. He is Aragorn son of Arathorn. You owe him your allegiance."
)

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "Aragorn! This...is Isildur's heir?"
)

Message.create(
  user_id: legolas.id,
  channel_id: channel_1.id,
  body: "and heir to the throne of Gondor"
)

Message.create(
  user_id: aragorn.id,
  channel_id: channel_1.id,
  body: "Havo dad (sit down), Legolas"
)

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "Gondor has no King...Gondor needs no King."
)

Message.create(
  user_id: gandalf.id,
  channel_id: channel_1.id,
  body: "Aragorn is right. We cannot use it."
)

Message.create(
  user_id: elrond.id,
  channel_id: channel_1.id,
  body: "You have only one choice. The Ring must be destroyed."
)

Message.create(
  user_id: gimli.id,
  channel_id: channel_1.id,
  body: "Then what are we waiting for?"
)

Message.create(
  user_id: elrond.id,
  channel_id: channel_1.id,
  body: "The Ring cannot be destroyed, Gimli, son of Gloin, by any craft that we here possess."
)

Message.create(
  user_id: elrond.id,
  channel_id: channel_1.id,
  body: "The Ring was made in the fires of Mount Doom. Only there can it be unmade."
)

Message.create(
  user_id: elrond.id,
  channel_id: channel_1.id,
  body: "It must be taken deep into Mordor and cast back into the firey chasm from whence it came."
)

Message.create(
  user_id: elrond.id,
  channel_id: channel_1.id,
  body: "One of you......must do this."
)

Message.create(
  user_id: boromir.id, 
  channel_id: channel_1.id, 
  body: "One does not simply walk into Mordor."
)

Message.create(
  user_id: boromir.id, 
  channel_id: channel_1.id, 
  body: "Its black gates are guarded by more than just orcs. There is evil there that does not sleep and the great eye is ever watchful."
)

Message.create(
  user_id: boromir.id, 
  channel_id: channel_1.id, 
  body: "Tis a barren wasteland, riddled with fire and ash and dust. The very air you breathe is a poisonous fume."
)

Message.create(
  user_id: boromir.id, 
  channel_id: channel_1.id, 
  body: "Not with ten thousand men could you do this. It is folly..."
)

Message.create(
  user_id: legolas.id, 
  channel_id: channel_1.id, 
  body: "Have you heard nothing Lord Elrond has said? The Ring must be destroyed!"
)

Message.create(
  user_id: gimli.id, 
  channel_id: channel_1.id, 
  body: "and I suppose you think you're the one to do it."
)

Message.create(
  user_id: boromir.id, 
  channel_id: channel_1.id, 
  body: "And if we fail, what then?"
)

Message.create(
  user_id: boromir.id, 
  channel_id: channel_1.id, 
  body: "What happens when Sauron takes back what is his?"
)

Message.create(
  user_id: gimli.id, 
  channel_id: channel_1.id, 
  body: "I will be dead before I see the Ring in the hands of an elf."
)

Message.create(
  user_id: gimli.id, 
  channel_id: channel_1.id, 
  body: "Never trust an elf!"
)

Message.create(
  user_id: gandalf.id, 
  channel_id: channel_1.id, 
  body: "Do you not understand that while we bicker amongst ourselves, Sauron's power grows?! None can escape it! You'll all be destroyed!"
)

Message.create(
  user_id: frodo.id, 
  channel_id: channel_1.id, 
  body: "I will take it!"
)

Message.create(
  user_id: frodo.id, 
  channel_id: channel_1.id, 
  body: "I will take it! I will take the Ring to Mordor. Tho, I do not know the way"
)

Message.create(
  user_id: gandalf.id, 
  channel_id: channel_1.id, 
  body: "I will help you bear this burden Frodo Baggins, as long as it is yours to bear."
)

Message.create(
  user_id: aragorn.id, 
  channel_id: channel_1.id, 
  body: "If by my life or death I can protect you, I will. You have my sword"
)

Message.create(
  user_id: legolas.id, 
  channel_id: channel_1.id, 
  body: "and you have my bow."
)

Message.create(
  user_id: gimli.id, 
  channel_id: channel_1.id, 
  body: "and my axe."
)

Message.create(
  user_id: boromir.id,
  channel_id: channel_1.id,
  body: "You carry the fate of us all little one. If this is indeed the will of the Council, then Gondor will see it done."
)

Message.create(
  user_id: sam.id,
  channel_id: channel_1.id,
  body: "Mr Frodo's not going anywhere without me."
)

Message.create(
  user_id: elrond.id,
  channel_id: channel_1.id,
  body: "	No indeed it is hardly possible to seperate you, even when he is summoned to a secret council and you are not!"
)

Message.create(
  user_id: merry.id,
  channel_id: channel_1.id,
  body: "	Wait! we're coming too!"
)

Message.create(
  user_id: merry.id,
  channel_id: channel_1.id,
  body: "You'd have to send us home tied up in a sack to stop us."
)

Message.create(
  user_id: pippin.id,
  channel_id: channel_1.id,
  body: "Anyway you need people of intelligence on this sort of mission ...........quest ..........thing."
)

Message.create(
  user_id: merry.id,
  channel_id: channel_1.id,
  body: "Well that rules you out Pip."
)

Message.create(
  user_id: elrond.id,
  channel_id: channel_1.id,
  body: "Nine companions... So be it! You shall be the Fellowship of the Ring!."
)

Message.create(
  user_id: pippin.id,
  channel_id: channel_1.id,
  body: "Great! Where are we going?"
)

# Seed data for general channel
message = Message.create(
  user_id: yuci.id,
  channel_id: general_channel.id,
  body:  "Welcome to Slock, a clone of Slack that has (almost) all of its key features!<br><ol><li>View user information by clicking on their icons in chat, or click on your own icon in the upper right to view and edit your information.</li><li>Hover over messages to add reacts, save, edit, or delete.</li><li>Access the channel, people, and saved items browsers at the top of the workspace sidebar on the left.</li><li>Send richly formatted messages and uploaded files using our versatile text editor.</li><li>View and edit channel details such as files, description, topic, members, and more by clicking on the channel name above.</li><li>Start video chats with people in your direct messages through our WebRTC video chatting service. Test this by logging in through \"Demo Login (alt)\" on another device (or an incognito window) and calling yourself!<br>Note: both users must be on the same wifi network as there is no TURN server set up.</li></ol>"
)
MessageReact.create(
  user_id: demo_user.id,
  message_id: message.id,
  react_code: "\u{1F60D}"
)
MessageSave.create(
  user_id: demo_user.id,
  message_id: message.id,
  workspace_id: demo_workspace.id
)

message = Message.create(
  user_id: yuci.id,
  channel_id: general_channel.id,
  body: "Thank you for taking the time to check out my work! If you don't have it already, please take a copy of my resume!"
)
MessageReact.create(
  user_id: demo_user.id,
  message_id: message.id,
  react_code: "\u{1F44D}"
)
MessageSave.create(
  user_id: demo_user.id,
  message_id: message.id,
  workspace_id: demo_workspace.id
)

# file = File.open("app/assets/pdfs/Resume - Yuci Shen.pdf")
# message.files.attach([{io: file, filename: "Resume - Yuci Shen.pdf"}])