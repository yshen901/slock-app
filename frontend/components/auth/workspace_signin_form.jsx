import React from 'react';
import AuthNav from './auth_nav';
import AuthFooter from './auth_footer';
import { Link } from 'react-router-dom';
import { getWorkspace } from '../../actions/session_actions';

class WorkspaceSigninForm extends React.Component {
  constructor() {
    super();
    this.state = {
      workspace_address: "",
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateForm = this.updateForm.bind(this);
  }


  /* NOTE: Dispatch returns a PROMISE
      ...Promises are code that are "promised" to run to completion before
         the callbacks in .then(successCallback, errorCallback) are called
  */
  handleSubmit(e) {
    e.preventDefault();
    dispatch(getWorkspace(this.state.workspace_address))
      .then(
        () => this.props.history.push(`/signin/${ this.state.workspace_address }`),
        () => this.props.history.push('/signin')
      );
  }

  updateForm(e) {
    this.setState({ workspace_address: e.currentTarget.value });
  }

  render() {
    return (
      <div className="auth-page">
        <AuthNav />
        <div className="auth-box" id="workspace-signin">
          <div className="auth-greeting">
            <h1>Sign in to your workspace</h1>
            <h4>Enter your workspace's <strong>Slock URL.</strong></h4>
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
          <h4 className="auth-box-footer">
            Don't know your workspace URL? 
            <Link to='/tbd' className='auth-form-link'>Find your workspace</Link>
          </h4>
        </div>

        <AuthFooter />
      </div>
    )
  }
}

export default WorkspaceSigninForm;