import React from "react";
import { Redirect } from 'react-router-dom';

class UserSigninForm extends React.Component {
  constructor(props) {
    super(props);

    // this.props.workspace_address is from the url params and is taken in using withRouter.
    //     to dry up code, I have moved this prop into the container
    this.state = {
      workspace_address: this.props.workspace_address,
      email: "",
      password: "",
      redirect: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateForm = this.updateForm.bind(this);
    this.createGreeting = this.createGreeting.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.processForm(this.state);
    this.setState({redirect: true});
  }

  updateForm(type) {
    return (e) => this.setState({ [type]: e.currentTarget.value })
  }

  createGreeting() {
    let address = this.state.workspace_address.split('-');
    return `${this.props.formType} to ${address.join(' ')}`;
  }

  render() {
    // TODO: DESIGN THE PAGE THAT IS REDIRECTED TO
    if (this.state.redirect) {
      return <Redirect to="/tbd" />
    } else {
      let greeting = this.createGreeting();
      return (
        <div id='user-signin'>
            <div id="greeting">
              <h1>{greeting}</h1>
              <br />
              <h4>Enter your workspace's Slock URL.</h4>
              <br />
            </div>
            <form onSubmit={this.handleSubmit}>
              <input type="text" 
                onChange={this.updateForm('email')}
                placeholder="you@example.com"/>
              <input type="password"
                onChange={this.updateForm('password')}
                placeholder="password" />
              <input type="submit" value="Sign In"/>
            </form>
        </div>
      )
    }
  }
}

export default UserSigninForm;