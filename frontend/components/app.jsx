import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute, AuthRoute } from '../util/route_util';

import Homepage from './homepage/homepage';
import UserSigninContainer from './auth/user_signin_container';
import UserSignupContainer from './auth/user_signup_container';
import WorkspaceSigninForm from './auth/workspace_signin_form.jsx';
import WorkspaceTransition from './workspace/workspace_transition';
import WorkspaceContainer from './workspace/workspace_container';
import WorkspaceForm from './auth/workspace_form';
import ChannelChatVideo from "./channel/channel_chat_video";


class App extends React.Component {
  /* NOTE: How to route to a path with params
             a) component must be wraped in withRouter
             b) Route must be wrapped in Router (done already in root.jsx)
  */
  render() {
    return (
      <div id="app-component">
        <Route exact path="/signin" component={ WorkspaceSigninForm }/>
        <AuthRoute exact path="/signup" component={ UserSignupContainer }/>
        <Route exact path="/signin/:workspace_address" component={ UserSigninContainer }/>
        <ProtectedRoute exact path="/create" component={ WorkspaceForm }/>
        <ProtectedRoute exact path="/workspace/:workspace_address" component={ WorkspaceTransition }/>
        <ProtectedRoute exact path="/workspace/:workspace_address/:channel_id" component={ WorkspaceContainer }/>
        <ProtectedRoute exact path="/workspace/:workspace_address/:channel_id/video_call" component={ ChannelChatVideo }/>
        <Route exact path="/" render={() => <Homepage></Homepage>}/>
      </div>
    )
  }
}

export default App;