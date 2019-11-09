import React from 'react';
import { Link } from 'react-router-dom';
import HomeNav from './home_nav';
import WorkspaceDropdown from '../modals/workspace_dropdown';

class Homepage extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
      listOpen: false
    }

    this.redirectTo = this.redirectTo.bind(this);
    this.changeField = this.changeField.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.dropdownClass = this.dropdownClass.bind(this);
  }

  
  changeField(e) {
    this.setState({ email: e.currentTarget.value });
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
      return "dropdown"
    else
      return "dropdown hidden"
  }

  render() {
    return (
      <div id="homepage">
        <HomeNav toggleDropdown={this.toggleDropdown} redirectTo={this.redirectTo}/>
        <WorkspaceDropdown dropdownClass={this.dropdownClass} redirectTo={this.redirectTo}/>

        <div id="home-box">
          <div id="home-greeting">
            <h1>Whatever work you do,</h1>
            <h1>you can do it in Slock</h1>
            <br/>
            <h4>Slock gives your team the power and alignment you need to do your best work.</h4>
            <br/>
          </div>

          <button className="home-button" onClick={() => this.redirectTo('/signup')}>Try Slock</button>

          <div id="signin-message">
            <h6>Already using Slock?</h6>
            <Link to='/signin'>Sign in.</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Homepage;