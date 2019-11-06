import React from 'react';
import { Link } from 'react-router-dom';

class HomeNav extends React.Component {
  render() {
    return (
      <div id="home-nav">
        <div id="links">
          <Link className="nav-link" to="/tbd">Why Slock?</Link>
          <Link className="nav-link" to="/tbd">Solutions</Link>
          <Link className="nav-link" to="/tbd">Resources</Link>
          <Link className="nav-link" to="/tbd">Enterprise</Link>
          <Link className="nav-link" to="/tbd">Pricing</Link>
        </div>
        <div id="auth">
          <Link className="nav-link" to="/signin">Sign In</Link>
        </div>
          
      </div>
    )
  }
}

export default HomeNav