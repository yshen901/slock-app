# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Message.destroy_all;
ChannelUser.destroy_all;
WorkspaceUser.destroy_all;
Channel.destroy_all;
Workspace.destroy_all;
User.destroy_all;

User.create(email: "morpheus@slock.com", password: "password")
User.create(email: "neo@slock.com", password: "password")
User.create(email: "apoc@slock.com", password: "password")
User.create(email: "cypher@slock.com", password: "password")
User.create(email: "trinity@slock.com", password: "password")

Workspace.create(address: 'slock')
WorkspaceUser.create(user_id: 1, workspace_id: 1)
WorkspaceUser.create(user_id: 2, workspace_id: 1)
WorkspaceUser.create(user_id: 3, workspace_id: 1)
WorkspaceUser.create(user_id: 4, workspace_id: 1)
WorkspaceUser.create(user_id: 5, workspace_id: 1)

Channel.create(name: "general", workspace_id: 1, description: "For general discussions and conversations", starred: false)
ChannelUser.create(user_id: 1, channel_id: 1)
ChannelUser.create(user_id: 2, channel_id: 1)
ChannelUser.create(user_id: 3, channel_id: 1)
ChannelUser.create(user_id: 4, channel_id: 1)
ChannelUser.create(user_id: 5, channel_id: 1)

Channel.create(name: "customer-support", workspace_id: 1, description: "For when you need help", starred: false)
ChannelUser.create(user_id: 1, channel_id: 2)
ChannelUser.create(user_id: 2, channel_id: 2)
ChannelUser.create(user_id: 3, channel_id: 2)
ChannelUser.create(user_id: 4, channel_id: 2)
ChannelUser.create(user_id: 5, channel_id: 2)

Channel.create(name: "information", workspace_id: 1, description: "For any questions you might have for me", starred: false)
ChannelUser.create(user_id: 1, channel_id: 3)
ChannelUser.create(user_id: 2, channel_id: 3)
ChannelUser.create(user_id: 3, channel_id: 3)
ChannelUser.create(user_id: 4, channel_id: 3)
ChannelUser.create(user_id: 5, channel_id: 3)

Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Welcome, Neo. As you no doubt have guessed, I am Morpheus."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "It's an honor."
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "No, the honor is mine. Please. Come. Sit."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "I imagine, right now, you must be feeling a bit like Alice, tumbling down the rabbit hole?"
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "You could say that."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "I can see it in your eyes. You have the look of a man who accepts what he sees because he is expecting to wake up."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Ironically, this is not far from the truth. But I'm getting ahead of myself. Can you tell me, Neo, why are you here?"
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "You're Morpheus. You're a legend. Most hackers would die to meet you."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Yes. Thank you. But I think we both know there's more to it than that. Do you believe in fate, Neo?"
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "No."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Why not?"
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "Because I don't like the idea that I'm not in control of my life."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "I know exactly what you mean."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: 
  "Let me tell you why you are here. You have come because you know something. What you know you can't explain but you feel it. You've felt it your whole life, felt that something is wrong with the world. You don't know what, but it's there like a splinter in your mind, driving you mad. It is this feeling that brought you to me. Do you know what I'm talking about?"
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "The Matrix?"
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Do you want to know what it is?"
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "The Matrix is everywhere, it's all around us, here even in this room. You can see it out your window or on your television. You feel it when you go to work, or go to church or pay your taxes. It is the world that has been pulled over your eyes to blind you from the truth."
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "What truth?"
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "That you are a slave, Neo. Like everyone else, you were born into bondage, kept inside a prison that you cannot smell, taste, or touch. A prison for your mind."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Unfortunately, no one can be told what the Matrix is. You have to see it for yourself."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "This is your last chance. After this, there is no going back. You take the blue pill and the story ends. You wake in your bed and you believe whatever you want to believe."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "You take the red pill and you stay in Wonderland and I show you how deep the rabbit-hole goes."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Remember that all I am offering is the truth. Nothing more."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Follow me."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Apoc, are we on-line?"
);
Message.create(
  user_id: 3, 
  channel_id: 1, 
  body: "Almost."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Neo, time is always against us. Will you take a seat there?"
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "You did all this?"
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "The pill you took is part of a trace program. It's designed to disrupt your input/output carrier signal so we can pinpoint your location."
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "What does that mean?"
);
Message.create(
  user_id: 4, 
  channel_id: 1, 
  body: "It means buckle up, Dorothy, 'cause Kansas is going bye-bye."
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "Did you...?"
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Have you ever had a dream, Neo, that you were so sure was real?"
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "This can't be..."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Be what? Be real?"
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "What if you were unable to wake from that dream, Neo? How would you know the difference between the dreamworld and the real world?"
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "Uh-oh..."
);
Message.create(
  user_id: 5, 
  channel_id: 1, 
  body: "It's going into replication."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Apoc?"
);
Message.create(
  user_id: 3, 
  channel_id: 1, 
  body: "Still nothing."
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Tank, we're going to need the signal soon."
);
Message.create(
  user_id: 2, 
  channel_id: 1, 
  body: "It's cold."
);
Message.create(
  user_id: 5, 
  channel_id: 1, 
  body: "I got fibrillation!"
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Shit! Apoc?"
);
Message.create(
  user_id: 3, 
  channel_id: 1, 
  body: "Targeting... almost there."
);
Message.create(
  user_id: 5, 
  channel_id: 1, 
  body: "He's going into arrest!"
);
Message.create(
  user_id: 3, 
  channel_id: 1, 
  body: "Lock! I got him!"
);
Message.create(
  user_id: 1, 
  channel_id: 1, 
  body: "Now, Tank, now!"
);
