import React from 'react';
import AuthNav from './auth_nav';
import AuthFooter from './auth_footer';
import WorkspaceDropdown from '../modals/workspace_dropdown';
import { Link } from 'react-router-dom';
import { findWorkspace } from '../../actions/workspace_actions';
import { refreshErrors } from '../../actions/error_actions';

import { hideElements } from '../../util/modal_api_util'; 
import { DEMO_WORKSPACE } from '../../actions/session_actions';

class WorkspaceSigninForm extends React.Component {
  constructor() {
    super();
    this.state = {
      workspace_address: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateForm = this.updateForm.bind(this);
    this.demoAction = this.demoAction.bind(this);
  }


  /* NOTE: Dispatch returns a PROMISE, reload =/= re-render
      1) Promises are code that are "promised" to run to completion before
         the callbacks in .then(successCallback, errorCallback) are called
      2) Use window.location.reload() to reload the page - this clears the state.
      3) For this case, you don't need to re-direct at all...just force a re-render
  */
  handleSubmit() {
    dispatch(findWorkspace(this.state.workspace_address))
      .then(
        () => this.props.history.push(`/signin/${ this.state.workspace_address }`),
        () => this.setState({state: this.state})
      );
  }

  updateForm(e) {
    this.setState({ workspace_address: e.currentTarget.value });
  }

  // Can only be triggered by demoButton
  demoAction(e) {
    e.preventDefault();
    e.stopPropagation();

    let demoWorkspaceAddress = DEMO_WORKSPACE;

    this.setState({workspace_address: ""});

    for (let i = 0; i < demoWorkspaceAddress.length; i++)
      setTimeout(() => {
        this.setState({workspace_address: this.state.workspace_address + demoWorkspaceAddress[i]})
      }, i*50);

    setTimeout(() => {
      this.handleSubmit();
    }, demoWorkspaceAddress.length * 50);
  }

  // Only shows for the demo workspace
  demoButton() {
    return (
      <button onClick={this.demoAction}>Demo Login</button>
    )
  }

  render() {
    let errors = getState().errors.session;
    let error_class = "auth-errors hidden";
    if (errors.length > 0) {
      error_class = "auth-errors";
      dispatch(refreshErrors());
    }
    return (
      <div className="auth-page" id="workspace-signin" onClick={() => hideElements("dropdown")}>
        <AuthNav />
        <WorkspaceDropdown dropdownClass="auth dropdown hidden" />

        <div className={error_class}>
          <h6>!!!</h6>
          <h6>
            <strong>We couldn't find your workspace.</strong> 
            &nbsp;If you can't remember your workspace's address, we can 
            &nbsp;<Link to='/tbd'>send you a reminder</Link>.
          </h6>
        </div>
        <div className="auth-box">
          <div className="auth-greeting">
            <h1>Sign in to your workspace</h1>
            <h4>Enter your workspace's <strong>Slock URL.</strong></h4>
          </div>
          <form onSubmit={this.handleSubmit}>
            <label>
              <input type="text" autoFocus
                onChange={this.updateForm}
                placeholder="your-workspace-url"
                align="left"
                value={this.state.workspace_address}/> .slock.com
            </label>
            <input type="submit" value={'Continue '}/>
            {this.demoButton()}
          </form>
          {/* <h4 className="auth-box-footer">
            Don't know your workspace URL? 
            <Link to='/tbd' className='auth-form-link'>Find your workspace</Link>
          </h4> */}
        </div>

        {/* <AuthFooter /> */}
      </div>
    )
  }
}

export default WorkspaceSigninForm;