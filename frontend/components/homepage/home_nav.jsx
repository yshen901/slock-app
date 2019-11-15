import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { toggleElements } from '../../util/modal_api_util';


class HomeNav extends React.Component {
  constructor(props) {
    super(props);
  }

  generateRight() {
    if(getState().session.user_id)
      return (
        <div className="right">
          <button className="nav-button" onClick={(e) => { e.stopPropagation(); toggleElements("dropdown") }}>
            <div>Your Workspaces</div>
          </button>
        </div>
      )
    else
      return (
        <div className="right">
          <Link className="home-link" to="/signin">Sign In</Link>
          <button className="nav-button" onClick={() => this.props.history.push('/signup')}>
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
          <a className="home-link" href="https://github.com/yshen901/"><i class='fab fa-github'></i> Github</a>
          <a className="home-link" href="https://www.linkedin.com/in/yucishen/"><i class="fa fa-linkedin-square"></i> LinkedIn</a>
        </div>
        {this.generateRight()}
      </div>
    )
  }
}

export default withRouter(HomeNav)