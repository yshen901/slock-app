import React from 'react';
import { Route } from 'react-router-dom'
import Homepage from './homepage/homepage';
import UserSigninContainer from './auth/user_signin_container';
import UserSignupContainer from './auth/user_signup_container';
import WorkspaceSigninForm from './auth/workspace_signin_form.jsx';


class App extends React.Component {
  /* NOTE: How to route to a path with params
             a) component must be wraped in withRouter
             b) Route must be wrapped in Router (done already in root.jsx)
  */
  render() {
    return (
      <div id="app-component">
        <Route exact path="/signin" component={WorkspaceSigninForm}/>
        <Route exact path="/signup" component={UserSignupContainer}/>
        <Route exact path="/signin/:workspace_address" component={UserSigninContainer}/>
        <Route exact path="/" component={Homepage}/>
      </div>
    )
  }
}

export default App;