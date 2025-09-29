import React from "react";
import { Link } from 'react-router-dom';

import AuthNav from './auth_nav';
import AuthFooter from './auth_footer';
import WorkspaceDropdown from '../modals/workspace_dropdown'
import { hideElements, focus } from '../../util/modal_api_util';

import {DEMO_WORKSPACE} from "../../actions/session_actions";

import { withRouter } from "../../withRouter";

class UserSigninForm extends React.Component {
  constructor(props) {
    super(props);

    // this.props.workspace_address is from the url params and is taken in using withRouter.
    //     to dry up code, I have moved this prop into the container
    this.state = {
      workspace_address: this.props.workspace_address,
      email: "",
      password: "",
      password_confirm: "",
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
        // REACT_UPDATE: Must use navigate wrapper for class components
        //               Hooks can be used for functional components
        // () => this.props.history.replace('/signin')
        () => this.props.navigate('/signin', { replace: true })

      )
  }

  // Only check workspace when looking at signin form
  componentDidMount() {
    if (this.props.formType === 'Sign in')
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
  handleSubmit(e) {
    // this.props.processForm(this.state)
    //   .then(
    //     () => this.props.getWorkspaces()
    //       .then( 
    //         () => this.props.history.push(`/workspace/${this.state.workspace_address}/0`)
    //       ),
    //     () => this.setState({state: this.state})
    //   )
    if (e)
      e.preventDefault();

    this.props.processForm(this.state)
      .then( 
        () => {
          if (this.props.formType === 'Sign in')
            this.props.navigate(`/workspace/${this.state.workspace_address}/0`)
          else
            this.props.navigate("/")
        },
      );
  }

  updateForm(type) {
    return (e) => {
      if (getState().errors.session.length > 0)
        this.props.refreshErrors();
      this.setState({ [type]: e.currentTarget.value })
    }
  }

  createGreeting() {
    return `${this.props.formType} to ${this.state.workspace_address}.slock.com`;
  }

  // Can only be triggered by demoButton
  demoAction(action) {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
  
      let demoEmail = "demoUser@slock.com";
      let demoPassword = "demoPassword";
      if (action == 2) {
        demoEmail = "gandalf@slock.com";
        demoPassword = "zunera";
      }
  
      this.setState({ email: "", password: ""});
      
      for (let i = 0; i < demoEmail.length; i++)
        setTimeout(() => {
          this.setState({email: this.state.email + demoEmail[i]})
        }, i*30);
  
      for (let i = 0; i < demoPassword.length; i++)
        setTimeout(() => {
          this.setState({password: this.state.password + demoPassword[i]})
        }, i*30 + demoEmail.length * 30);
  
      setTimeout(() => {
        this.handleSubmit();
      }, (demoEmail.length + demoPassword.length) * 31);
    }
  }

  // Only shows for the demo workspace
  demoButton() {
    if (this.state.workspace_address !== DEMO_WORKSPACE)
      return "";
    else
      return (
        <button onClick={this.demoAction(1)}>Demo Login</button>
      )
  }

  demoButtonAlt() {
    if (this.state.workspace_address !== DEMO_WORKSPACE)
      return "";
    else
      return (
        <div className="alt-demo-login" onClick={this.demoAction(2)}>Demo Login (alt)</div>
      )
  }

  render() {
    let greeting = this.createGreeting();
    let { password, password_confirm, email } = this.state;

    // Renders user auth errors
    let error_class = "auth-errors hidden"
    let error_messages = [];
    if (getState().errors.session.length > 0) {
      error_class = "auth-errors";
      error_messages.push(0)
    }

    // Checks for password confirmation when signing in
    let passwordConfirm = "";
    if (this.props.formType == "Sign up") {
      passwordConfirm = (
        <input type="password"
              onChange={this.updateForm('password_confirm')}
              placeholder="confirm password" 
              value={this.state.password_confirm}/>
      )

      if (password && password.length < 6) {
        error_class = "auth-errors";
        error_messages.push(2);
      }
      else if (password_confirm && password_confirm != password) {
        error_class = "auth-errors";
        error_messages.push(1);
      }
    }

    // Disables the button if conditions aren't met
    let disabled = "";
    if (password == "" || email == "")
      disabled = "disabled";
    else if (this.props.formType == "Sign up" && (password_confirm == "" || password_confirm != password))
      disabled = "disabled";

    return (
      <div className="auth-page" id='user-signin' onClick={() => hideElements("dropdown-modal")}>
        <AuthNav />
        <WorkspaceDropdown dropdownClass="auth dropdown hidden" />

        <div className={error_class}>
          <h6>!!!</h6>
          {error_messages.map(idx => (
            <h6 key={idx}>{this.props.error_messages[idx]}</h6>
          ))}
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
            { passwordConfirm }
            <input type="submit" 
              value={this.props.formType}
              disabled={disabled}/>
          </form>
          {this.demoButton()}
          {this.demoButtonAlt()}
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

export default withRouter(UserSigninForm);