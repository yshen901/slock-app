import React from 'react';
import { Link } from 'react-router-dom';
import { toggleFocusElements } from '../../util/modal_api_util';

class AuthNav extends React.Component {
  right() {
    if (getState().session.user_id)
      return (
        <div className="right">
          <Link className="auth-nav-link" to="/create">Create a new workspace</Link>
          <div id="auth-signin" onClick={toggleFocusElements("dropdown-modal workspaces")}>Your Workspaces</div>
        </div>
      )
    else {  // Returns either signin or signup button depending on the page
      let link = '/signin';
      let linkName = "Sign In"
      if (window.location.href.indexOf('signin') >= 0) {
        link = '/signup'
        linkName = "Sign Up"
      }
      return (
        <div className="right">
          <Link id="auth-signin" to={link}>{linkName}</Link>
        </div> 
      )
    }
    
  }
  render() {
    return (
      <div className="nav">
        <div className="left">
          <Link className="logo" to='/'>
            <img src="/images/logo.jpg" />
          </Link>
        </div>
        {this.right()}
      </div>
    )
  }
}

export default AuthNav;