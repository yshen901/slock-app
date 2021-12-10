import React from 'react';
import { Link } from 'react-router-dom';
import { toggleElements } from '../../util/modal_api_util';

class AuthNav extends React.Component {
  right() {
    if (getState().session.user_id)
      return (
        <div className="right">
          {/* <Link className="auth-nav-link" to="/tbd">Product</Link>
          <Link className="auth-nav-link" to="/tbd">Pricing</Link>
          <Link className="auth-nav-link" to="/tbd">Support</Link> */}
          <Link className="auth-nav-link" to="/tbd">Create a new workspace</Link>
          <div id="auth-signin" onClick={(e) => {e.stopPropagation(); toggleElements("dropdown")}}>Your Workspaces</div>
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
          {/* <Link className="auth-nav-link" to="/tbd">Product</Link>
          <Link className="auth-nav-link" to="/tbd">Pricing</Link>
          <Link className="auth-nav-link" to="/tbd">Support</Link> */}
          {/* <Link className="auth-nav-link" to="/tbd">Create a new workspace</Link> */}
          {/* <Link className="auth-nav-link" to="/tbd">Find your workspace</Link> */}
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