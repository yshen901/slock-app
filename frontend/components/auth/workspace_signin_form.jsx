import React from 'react';
import { Redirect } from 'react-router-dom';

class WorkspaceSigninForm extends React.Component {
  constructor() {
    super();
    this.state = {
      workspace_name: "",
      redirect: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateForm = this.updateForm.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ redirect: true });
  }

  updateForm(e) {
    this.setState({ workspace_name: e.currentTarget.value });
  }

  /* NOTE: unicode and redirecting with link params (/signup/:workspace_address)
        1) HOW TO INTERPOLATE UNICODE SYMBOL
        2) How to redirect and save information in the link params
  */
  render() {
    // TODO: REDIRECT TO YOURSELF IMMEDIATELY IF THE WORKSPACE DOESN'T EXIST
    //       RATHER THAN HANDING IT OFF TO THE NEXT PAGE
    if (this.state.redirect) {
      let redirect_link = `/signin/${this.state.workspace_name}`;
      return <Redirect to={redirect_link}/>
    } else {
      return (
        <div id="workspace-signin">
          <div id="greeting">
            <h1>Sign in to your workspace</h1>
            <br />
            <h4>Enter your workspace's Slock URL.</h4>
            <br />
          </div>
          <form onSubmit={this.handleSubmit}>
            <label>
              <input type="text" 
                onChange={this.updateForm}
                placeholder="your-workspace-url"
                align="left"/> .slock.com
            </label>
            <input type="submit" value={'Continue '}/>
          </form>
        </div>
      )
    }
  }
}

export default WorkspaceSigninForm;