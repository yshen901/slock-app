import React from 'react';
import { Link } from 'react-router-dom';
import HomeNav from './home_nav';
import { objectToArray } from '../../selectors/selectors';

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
    this.drowndownClass = this.dropdownClass.bind(this);
    this.dropdownMenu = this.dropdownMenu.bind(this);
  }

  redirectTo(path) {
    this.props.history.push(path);
  }
  
  changeField(e) {
    this.setState({ email: e.currentTarget.value });
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

  dropdownMenu() {
    let workspaces = objectToArray(getState().entities.workspaces);
    return (
      <div className={this.dropdownClass()}>
        <div className="dropdown-workspaces">
          {workspaces.map((workspace, idx) => {
            return (
              <div className="dropdown-item" onClick={() => this.redirectTo(`/workspace/${workspace.id}`)}>
                &#9824; {workspace.address}
              </div>
            )
          })}
        </div>
        <div className="dropdown-auth-links">
          <Link className="dropdown-link" to="/signin">Sign Into Another Workspace</Link>
          <Link className="dropdown-link" to="/create">Create Workspace</Link>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div id="homepage">
        <HomeNav toggleDropdown={this.toggleDropdown} redirectTo={this.redirectTo}/>
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

        {this.dropdownMenu()}
      </div>
    )
  }
}

export default Homepage;