import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import HomeNav from './home_nav';

class Homepage extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
      redirect: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeField = this.changeField.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({redirect: true});
  }
  
  changeField(e) {
    this.setState({ email: e.currentTarget.value });
  }

  render() {
    if (this.state.redirect)
      return <Redirect to="/signup"/> 
    else
      return (
        <div id="homepage">
          <HomeNav />
          <div id="home-box">
            <div id="home-greeting">
              <h1>Whatever work you do,</h1>
              <h1>you can do it in Slock</h1>
              <br/>
              <h4>Slock gives your team the power and alignment you need to do your best work.</h4>
              <br/>
            </div>

            <button className="home-button" onClick={this.handleSubmit}>Try Slock</button>

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