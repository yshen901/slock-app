import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { logout } from '../../actions/session_actions';

class HomeNav extends React.Component {
  constructor(props) {
    super(props);

    this.logoutUser = this.logoutUser.bind(this);
  }

  logoutUser(e) {
    e.stopPropagation();
    dispatch(logout())
    .then(
      () => {
        this.props.history.push('/');
      }
    )
  }

  generateRight() {
    if(getState().session.user_id)
      return (
        <div className="right">
          <button className="nav-button" onClick={this.logoutUser}>
            <div>Sign Out</div>
          </button>
        </div>
      )
    else
      return (
        <div className="right">
          <Link className="home-link no-hightlight" to="/signin">Sign In</Link>
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
            <img src="/images/logo.jpg"/>
          </Link>
          <a className="home-link no-highlight" to="https://github.com/yshen901" onClick={() => window.open("https://github.com/yshen901")}><i className='fab fa-github'></i> Github</a>
          <a className="home-link no-highlight" to="https://www.linkedin.com/in/yucishen/" onClick={() => window.open("https://www.linkedin.com/in/yucishen/")}><i className="fa fa-linkedin-square"></i> Linkedin</a>
        </div>
        {this.generateRight()}
      </div>
    )
  }
}

export default withRouter(HomeNav)