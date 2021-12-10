import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import HomeNav from './home_nav';
import WorkspaceDropdown from '../modals/workspace_dropdown';
import { hideElements } from '../../util/modal_api_util';
import { DEMO_WORKSPACE } from '../../actions/session_actions';
import { objectToArray } from '../../selectors/selectors';

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

  workspaceList() {
    let workspaces = objectToArray(getState().entities.workspaces);
    return workspaces.map((workspace, key) => (
      <div className="workspace">
        <div className="workspace-details">
          <div className="workspace-address">{workspace.address}</div>
          <div className="workspace-users">X users</div>
        </div>
        <button 
          className="home-button" 
          onClick={() => this.props.history.push(`/workspace/${workspace.address}/0`)}
        >Launch Slock</button>
      </div>
    ))
  }

  render() {
    let { user_id } = getState().session;

    // When user is signed in, display workspaces and create/join buttons
    if (user_id) { 
      return (
        <div id="homepage" onClick={() => hideElements("dropdown")}>
          <HomeNav />
          <WorkspaceDropdown dropdownClass="dropdown hidden" />

          <div id="home-box">
            <div id="home-greeting">
              <h1>Welcome back</h1>
              <h4>What are you working on today?</h4>
            </div>

            <div id="home-workspaces">
              {this.workspaceList()}
            </div>
            <div id="home-buttons">
              <button className="home-button" onClick={(e) => { this.props.history.push(`/create`) }}>Create a workspace</button>
              <button className="home-button" onClick={(e) => { this.props.history.push(`/signin`) }}>Sign in to another workspace</button>
            </div>
          </div>
        </div>
      )
    }

    // When user isn't signed in, display try now button
    else { 
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

            <button className="home-button" onClick={(e) => { this.props.history.push(`/signin`) }}>Demo Login</button>
          </div>
        </div>
      )
    }
  }
}

export default withRouter(Homepage);