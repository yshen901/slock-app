# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user = User.create(email: "boromir@slock.com", password: "zunera")
file = File.open("app/assets/images/boromir.jpg")
user.photo.attach({io: file, filename: "boromir.jpg"})

user = User.create(email: "gandalf@slock.com", password: "zunera")
file = File.open("app/assets/images/gandalf.png")
user.photo.attach({io: file, filename: "gandalf.png"})

user = User.create(email: "legolas@slock.com", password: "zunera")
file = File.open("app/assets/images/legolas.jpg")
user.photo.attach({io: file, filename: "legolas.jpg"})

user = User.create(email: "gimli@slock.com", password: "zunera")
file = File.open("app/assets/images/gimli.png")
user.photo.attach({io: file, filename: "gimli.png"})

user = User.create(email: "frodo@slock.com", password: "zunera")
file = File.open("app/assets/images/frodo.jpg")
user.photo.attach({io: file, filename: "frodo.jpg"})

user = User.create(email: "aragorn@slock.com", password: "zunera")
file = File.open("app/assets/images/aragorn.jpg")
user.photo.attach({io: file, filename: "aragorn.jpg"})

Workspace.create(address: 'slock')
WorkspaceUser.create(user_id: 1, workspace_id: 1)
WorkspaceUser.create(user_id: 2, workspace_id: 1)
WorkspaceUser.create(user_id: 3, workspace_id: 1)
WorkspaceUser.create(user_id: 4, workspace_id: 1)
WorkspaceUser.create(user_id: 5, workspace_id: 1)
WorkspaceUser.create(user_id: 6, workspace_id: 1)

Channel.create(name: "Council of Elrond", workspace_id: 1, description: "What to do about the One Ring", starred: false)
ChannelUser.create(user_id: 1, channel_id: 1)
ChannelUser.create(user_id: 2, channel_id: 1)
ChannelUser.create(user_id: 3, channel_id: 1)
ChannelUser.create(user_id: 4, channel_id: 1)
ChannelUser.create(user_id: 5, channel_id: 1)
ChannelUser.create(user_id: 6, channel_id: 1)

Channel.create(name: "customer-support", workspace_id: 1, description: "For when you need help", starred: false)
ChannelUser.create(user_id: 1, channel_id: 2)
ChannelUser.create(user_id: 2, channel_id: 2)
ChannelUser.create(user_id: 3, channel_id: 2)
ChannelUser.create(user_id: 4, channel_id: 2)
ChannelUser.create(user_id: 5, channel_id: 2)
ChannelUser.create(user_id: 6, channel_id: 2)

Channel.create(name: "information", workspace_id: 1, description: "For any questions you might have for me", starred: false)
ChannelUser.create(user_id: 1, channel_id: 3)
ChannelUser.create(user_id: 2, channel_id: 3)
ChannelUser.create(user_id: 3, channel_id: 3)
ChannelUser.create(user_id: 4, channel_id: 3)
ChannelUser.create(user_id: 5, channel_id: 3)
ChannelUser.create(user_id: 6, channel_id: 3)

Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "One does not simply walk into Mordor.  Its black gates are guarded by more than just orcs. There is evil there that does not sleep and the great eye is ever watchful.  Tis a barren wasteland, riddled with fire and ash and dust.  The very air you breathe is a poisonous fume.  Not with ten thousand men could you do this. It is folly..."
);
Message.create(
  user_id: 3, 
  channel_id: 1, 
  body: "Have you heard nothing Lord Elrond has said? The Ring must be destroyed!"
);
Message.create(
  user_id: 4, 
  channel_id: 1, 
  body: "and I suppose you think you're the one to do it."
);

Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "And if we fail, what then?"
);

Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "What happens when Sauron takes back what is his?"
);

Message.create(
  user_id: 4, 
  channel_id: 1, 
  body: "I will be dead before I see the Ring in the hands of an elf."
);

Message.create(
  user_id: 4, 
  channel_id: 1, 
  body: "Never trust an elf!"
);

Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "Do you not understand that while we bicker amongst ourselves, Sauron's power grows?! None can escape it! You'll all be destroyed!"
);

Message.create(
  user_id: 5, 
  channel_id: 1, 
  body: "I will take it!"
);

Message.create(
  user_id: 5, 
  channel_id: 1, 
  body: "I will take it! I will take the Ring to Mordor. Tho, I do not know the way"
);

Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "I will help you bear this burden Frodo Baggins, as long as it is yours to bear."
);

Message.create(
  user_id: 6, 
  channel_id: 1, 
  body: "If by my life or death I can protect you, I will. You have my sword"
);

Message.create(
  user_id: 3, 
  channel_id: 1, 
  body: "and you have my bow."
);

Message.create(
  user_id: 4, 
  channel_id: 1, 
  body: "and my axe."
);

Message.create(
  user_id: 1,
  channel_id: 1,
  body: "You carry the fate of us all little one. If this is indeed the will of the Council, then Gondor will see it done."
)

