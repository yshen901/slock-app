import React from 'react';
import { Link } from 'react-router-dom';


// TODO1: THE RIGHT SIDE SHOULD BE DIFFERENT WHEN YOU ARE LOGGED IN
class HomeNav extends React.Component {
  constructor(props) {
    super(props);
  }

  generateRight() {
    if(getState().session.workspace_id)
      return (
        <div className="right">
          <button className="nav-button" onClick={this.props.toggleDropdown}>
            <div>Your Workspaces</div>
          </button>
        </div>
      )
    else
      return (
        <div className="right">
          <Link className="home-link" to="/signin">Sign In</Link>
          <button className="nav-button" onClick={() => this.props.redirectTo('/signup')}>
            <div>Get Started</div>
          </button>
        </div>
      )
  }

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
        {this.generateRight()}
      </div>
    )
  }
}

export default HomeNav