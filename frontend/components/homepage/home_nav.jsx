import React from 'react';
import { Link } from 'react-router-dom';

class HomeNav extends React.Component {
  render() {
    return (
      <div id="nav">
        <div id="left">
          <Link className="home-link" to="/tbd">Why Slock?</Link>
          <Link className="home-link" to="/tbd">Solutions</Link>
          <Link className="home-link" to="/tbd">Resources</Link>
          <Link className="home-link" to="/tbd">Enterprise</Link>
          <Link className="home-link" to="/tbd">Pricing</Link>
        </div>
        <div id="right">
          <Link className="home-link" to="/signin">Sign In</Link>
        </div>
          
      </div>
    )
  }
}

export default HomeNav