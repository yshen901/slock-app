import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import HomeNav from './home_nav';
import WorkspaceDropdown from '../modals/workspace_dropdown';
import { hideElements } from '../../util/modal_api_util';
import { DEMO_WORKSPACE } from '../../actions/session_actions';

class Homepage extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
    }

    this.changeField = this.changeField.bind(this);
    // this.newUser = this.newUser.bind(this);
  }
  
  changeField(e) {
    this.setState({ email: e.currentTarget.value });
  }

  // newUser() {
  //   if(getState().session.user_id === null)
  //     return (
  //       <div>
  //         <button className="home-button" onClick={(e) => { this.props.history.push('/signup') }}>Try Slock</button>

  //         <div id="signin-message">
  //           <h6>Already using Slock?</h6>
  //           <Link to='/signin'>Sign in.</Link>
  //         </div>
  //       </div>
  //     )
  // }

  render() {
    let tryButton, signInLink, demoButton;

    if (getState().session.user_id) {
      signInLink = (
        <div id='signed-in-message'>
          <h6><strong>Already signed in!</strong></h6>
          <h6>Click Your Workspaces to select your workspace!</h6>
        </div>
      )
    }
    else {
      tryButton = (
        <button className="home-button" onClick={(e) => { this.props.history.push('/signup') }}>Try Slock</button>
      );
      
      demoButton = (
        <button className="home-button" onClick={(e) => { this.props.history.push(`/signin`) }}>Demo Login</button>
      );

      signInLink = (
        <div id="signin-message">
          <h6>Already using Slock?</h6>
          <Link to='/signin'>Sign in.</Link>
        </div>
      );
    }

    return (
      <div id="homepage" onClick={() => hideElements("dropdown")}>
        <HomeNav />
        <WorkspaceDropdown dropdownClass="dropdown hidden" />

        <div id="home-box">
          <div id="home-greeting">
            <h1>Whatever work you do,</h1>
            <h1>you can do it in Slock</h1>
            <br/>
            <h4>Slock gives your team the power and alignment you need to do your best work.</h4>
          </div>

          { demoButton }
          {/* { signInLink } */}

        </div>
      </div>
    )
  }
}

export default withRouter(Homepage);