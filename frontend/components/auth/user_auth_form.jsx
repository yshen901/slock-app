import React from "react";
import { Link } from 'react-router-dom';
import AuthNav from './auth_nav';
import AuthFooter from './auth_footer';
import WorkspaceDropdown from '../modals/workspace_dropdown'

class UserSigninForm extends React.Component {
  constructor(props) {
    super(props);

    // this.props.workspace_address is from the url params and is taken in using withRouter.
    //     to dry up code, I have moved this prop into the container
    this.state = {
      workspace_address: this.props.workspace_address,
      email: "",
      password: "",
      listOpen: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateForm = this.updateForm.bind(this);
    this.createGreeting = this.createGreeting.bind(this);

    this.redirectTo = this.redirectTo.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.dropdownClass = this.dropdownClass.bind(this);
  }

  // TODO2: How to do this without double action
  componentDidMount() {
    this.props.findWorkspace(this.props.workspace_address)
      .then(
        null,
        () => this.props.history.push('/signin')
      )
  }

  /* NOTE: ALTERNATIVE WAY TO REDIRECT
      CHANGING PROPS WILL TRIGGER A RE-RENDER OF THE FIRST THING IN HISTORY
      THIS WAY AVOIDS HAVING TO PASS AROUND STUFF, AND RENDER/HANDLESUBMIT CAN BE SEPARATE
  */
  handleSubmit(e) {
    e.preventDefault();
    this.props.processForm(this.state)
      .then(
        // () => this.props.history.push('/'),
        () => this.props.history.push(`/workspace/${this.state.workspace_address}/0`),
        () => this.setState({state: this.state})
      )
  }

  updateForm(type) {
    return (e) => this.setState({ [type]: e.currentTarget.value })
  }

  createGreeting() {
    let address = this.state.workspace_address.split('-');
    return `${this.props.formType} to ${address.join(' ')}`;
  }

  redirectTo(path) {
    this.props.history.push(path);
  }

  toggleDropdown() {
    if (this.state.listOpen)
      this.setState({ listOpen: false })
    else
      this.setState({ listOpen: true })
  }

  dropdownClass() {
    if (this.state.listOpen)
      return "auth dropdown"
    else
      return "auth dropdown hidden"
  }

  render() {
    let greeting = this.createGreeting();
    let error_class = "auth-errors hidden"
    if (getState().errors.session.length > 0) {
      error_class = "auth-errors";
      this.props.refreshErrors();
    }
    return (
      <div className="auth-page" id='user-signin' onClick={() => this.setState({ listOpen: false })}>
        <AuthNav toggleDropdown={this.toggleDropdown} />
        <WorkspaceDropdown dropdownClass={this.dropdownClass} redirectTo={this.redirectTo} />

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
            <input type="text" 
              onChange={this.updateForm('email')}
              placeholder="you@example.com"/>
            <input type="password"
              onChange={this.updateForm('password')}
              placeholder="password" />
            <input type="submit" value={this.props.formType}/>
          </form>
          <h4 className="auth-box-footer">
            <Link to='/tbd' className='auth-form-link'>Forgot your password?</Link>
            &bull;
            <Link to='/tbd' className='auth-form-link'>Forgot which email you used?</Link>
          </h4>
        </div>
        <AuthFooter />
      </div>
    )
  }
}

export default UserSigninForm;