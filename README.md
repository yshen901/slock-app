
# <a href="https://slock-app.herokuapp.com/#/" target="_blank">Slock</a>

## Background 
Slock is a text, voice, and video chatting platform that attempts to provide an identical experience to that of Slack. Built off of React/Redux and Ruby on Rails, Slock offers private workspaces and channels on which users can send live messages, share files, react to and save content, and video chat with teammates. 

## Technologies Used
* **Ruby on Rails:** Ruby on Rails was used to manage the backend of the application.
* **React/Redux:** React/Redux was used to manage the frontend of the application.
* **PostgreSQL:** PostgreSQL was used as the database for the project. 
* **Websockets/ActionCable:** Websockets was used through Rail's ActionCable to send live messages, reacts, user status updates, and call notifications.
* **WebRTC:** WebRTC was used to enable voice and video chatting through peer-to-peer connections.
* **AWS S3:** AWS S3 was used as a cloud hosting platform that allows users to set custom profile photos as well as upload files to the chat.

## Feature Highlights
### User Authentication
Users accounts, messages, and information are all kept behind a two-step authentication system similar to Slack. A demo user account is also available for anyone who wants to test out Slock without creating their own account.

### Workspaces/Channels/DMs
Users can create workspaces and invite other Slock users by adding them to the workspace. Workspace users can create channels and view/edit channel information such as topic, description, members, and files. Asides from channels, users can also start DMs with individual users either through the users browser or by clicking on the user in chat. 

### Live Messenger
All channels and DMs feature a live message chat, where other users on the workspace will instantly see messages, reacts, and DM requests as soon as they are sent. This is implemented using ActionCable, which uses the WebSockets protocol to connect users on the same workspace through a subscription. Through this connection, all user message actions will be broadcast instantly to all subscribed users as soon as they are sent out. 

### RichText Messages and File Attachments
Users can add bold, italic, strikethrough, and underlined text to their messages through the RichText editor. They can also create lists, add links and emojis, as well as upload files that are hosted on AWS S3 and can be downloaded by other users. 

### Message Interaction
Like in Slack, users can react to messages, add them to their saved items, as well as edit/delete messages they have already sent out. All edits and reacts are instantly broadcast to other users through ActionCable, adding to the live messenger experience. 

### User Profile and Status
Users can upload custom profile photos, which are compressed and then stored in an AWS S3 server, as well as set their timezone for more accurate timestamps. They can also set their activity level, pause/unpause notifications, and update their status to let other users know what they are up to. 

### Voice/Video Chat
Users can start voice/video chats with other members of their workspace by clicking on their profile photo in the chat, or by going to their DM channel. The other user will then receive an incoming call alert that they can either accept or decline. The video chat feature is built off of WebRTC, and uses a STUN server to establish a peer-to-peer connection through which the voice and video can be exchanged. This feature currently only works for users on the same wifi network, as the STUN server does not allow for peer-to-peer connections across different networks due to security concerns. A TURN cloud server will be set up in the future to enable calls across the internet. 
