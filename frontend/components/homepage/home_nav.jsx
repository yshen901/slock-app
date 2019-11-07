import React from 'react';
import { Link } from 'react-router-dom';


// TODO: THE RIGHT SIDE SHOULD BE DIFFERENT WHEN YOU ARE LOGGED IN
class HomeNav extends React.Component {
  render() {
    return (
      <div className="nav" id="home-nav">
        <div className="left">
          <Link className="logo" to="/">
            <img src="/images/logo.png"/>
          </Link>
          <Link className="home-link" to="/tbd">Why Slock?</Link>
          <Link className="home-link" to="/tbd">Solutions</Link>
          <Link className="home-link" to="/tbd">Resources</Link>
          <Link className="home-link" to="/tbd">Enterprise</Link>
          <Link className="home-link" to="/tbd">Pricing</Link>
        </div>
        <div className="right">
          <Link className="home-link" to="/signin">Sign In</Link>
          <button className="home-button" onClick={this.handleSubmit}>Try Slock</button>
        </div>
          
      </div>
    )
  }
}

export default HomeNav