import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import HomeNav from './home_nav';
import WorkspaceDropdown from '../modals/workspace_dropdown';

class Homepage extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
    }

    this.changeField = this.changeField.bind(this);
  }
  
  changeField(e) {
    this.setState({ email: e.currentTarget.value });
  }

  render() {
    return (
      <div id="homepage" onClick={e => this.setState({listOpen: false})}>
        <HomeNav />
        <WorkspaceDropdown dropdownClass="dropdown hidden" />

        <div id="home-box">
          <div id="home-greeting">
            <h1>Whatever work you do,</h1>
            <h1>you can do it in Slock</h1>
            <br/>
            <h4>Slock gives your team the power and alignment you need to do your best work.</h4>
            <br/>
          </div>

          <button className="home-button" onClick={(e) => {this.props.history.push('/signup')}}>Try Slock</button>

          <div id="signin-message">
            <h6>Already using Slock?</h6>
            <Link to='/signin'>Sign in.</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Homepage);