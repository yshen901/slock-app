import React from "react";
import { Link } from 'react-router-dom';

import AuthNav from './auth_nav';
import AuthFooter from './auth_footer';
import WorkspaceDropdown from '../modals/workspace_dropdown'
import { hideElements, focus } from '../../util/modal_api_util';

import {DEMO_WORKSPACE} from "../../actions/session_actions";

class UserSigninForm extends React.Component {
  constructor(props) {
    super(props);

    // this.props.workspace_address is from the url params and is taken in using withRouter.
    //     to dry up code, I have moved this prop into the container
    this.state = {
      workspace_address: this.props.workspace_address,
      email: "",
      password: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateForm = this.updateForm.bind(this);
    this.createGreeting = this.createGreeting.bind(this);
    this.demoAction = this.demoAction.bind(this);
  }

  checkWorkspace(address) {
    this.props.findWorkspace(address)
      .then(
        null,
        () => this.props.history.replace('/signin')
      )
  }

  componentDidMount() {
    this.checkWorkspace(this.props.workspace_address)
  }

  componentDidUpdate(oldProps) {
    if (this.props.match.params.workspace_address !== oldProps.match.params.workspace_address)
      this.checkWorkspace(this.props.match.params.workspace_address)
  }

  /* NOTE: REDIRECT AFTER UPDATING THE STATE TO AVOID HAVING TO DO IT IN COMPONENTDIDMOUNT 
           DISPATCHES HERE RETURN A PAYLOAD...AKA THE ACTION...NOT THE JBUILDER RESPONSE
  */

  //NOTE: CHAIN DISPATCH(SOMETHING).THEN(...) TO ENSURE SYNCRONOUS BEHAVIOR
  //INTERESTING BUG: IF INFO IN THEN ISN'T A CALLBACK, IT IS RUN IMMEDIATELY RATHER THAN AFTER THE PROMISE IS DONE
  handleSubmit() {
    // this.props.processForm(this.state)
    //   .then(
    //     () => this.props.getWorkspaces()
    //       .then( 
    //         () => this.props.history.push(`/workspace/${this.state.workspace_address}/0`)
    //       ),
    //     () => this.setState({state: this.state})
    //   )
    this.props.processForm(this.state)
      .then( 
        () => this.props.history.push(`/workspace/${this.state.workspace_address}/0`),
        () => this.setState({state: this.state})
      );
  }

  updateForm(type) {
    return (e) => this.setState({ [type]: e.currentTarget.value })
  }

  createGreeting() {
    let address = this.state.workspace_address.split('-');
    return `${this.props.formType} to ${address.join(' ')}.slock.com`;
  }

  // Can only be triggered by demoButton
  demoAction(e) {
    e.preventDefault();
    e.stopPropagation();

    let demoEmail = "demoUser@slock.com";
    let demoPassword = "demoPassword";

    this.setState({ email: "", password: ""});
    
    for (let i = 0; i < demoEmail.length; i++)
      setTimeout(() => {
        this.setState({email: this.state.email + demoEmail[i]})
      }, i*50);

    for (let i = 0; i < demoPassword.length; i++)
      setTimeout(() => {
        this.setState({password: this.state.password + demoPassword[i]})
      }, i*50 + demoEmail.length * 50);

    setTimeout(() => {
      this.handleSubmit();
    }, (demoEmail.length + demoPassword.length) * 50);
  }

  // Only shows for the demo workspace
  demoButton() {
    if (this.state.workspace_address !== DEMO_WORKSPACE)
      return "";
    else
      return (
        <button onClick={this.demoAction}>Demo Login</button>
      )
  }

  render() {
    let greeting = this.createGreeting();
    let error_class = "auth-errors hidden"
    if (getState().errors.session.length > 0) {
      error_class = "auth-errors";
      this.props.refreshErrors();
    }

    return (
      <div className="auth-page" id='user-signin' onClick={() => hideElements("dropdown")}>
        <AuthNav />
        <WorkspaceDropdown dropdownClass="auth dropdown hidden" />

        <div className={error_class}>
          <h6>!!!</h6>
          <h6>{this.props.error_message}</h6>
        </div>
        <div className='auth-box'>
          <div className="auth-greeting">
            <h1>{greeting}</h1>
            <br/>
            <h4>Enter your <strong>email address</strong> and <strong>password.</strong></h4>
          </div>
          <form onSubmit={this.handleSubmit}>
            <input type="text" autoFocus
              onChange={this.updateForm('email')}
              placeholder="name@work-email.com"
              value={this.state.email}/>
            <input type="password"
              onChange={this.updateForm('password')}
              placeholder="password" 
              value={this.state.password}/>
            <input type="submit" value={this.props.formType}/>
          </form>
          {this.demoButton()}
          {/* <h4 className="auth-box-footer">
            <Link to='/tbd' className='auth-form-link'>Forgot your password?</Link>
            &bull;
            <Link to='/tbd' className='auth-form-link'>Forgot which email you used?</Link>
          </h4> */}
        </div>
        {/* <AuthFooter /> */}
      </div>
    )
  }
}

export default UserSigninForm;