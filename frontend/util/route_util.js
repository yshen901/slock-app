import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';

/* NOTE: How to create routes with additional conditions (i.e. Protected/Auth) */
const Protected = ({ component: Component, path, loggedIn, exact }) => {
  return (
    <Route
      path={path}
      exact={exact}
      render= { 
        props => !loggedIn ? <Redirect to="/signin" /> : <Component {...props} />
      }
    />
  );
}

const Auth = ({ component: Component, path, loggedIn, exact }) => {
  return (
    <Route 
    path={path}
    exact={exact}
    render={
      props => loggedIn ? <Redirect to="/"/> : <Component {...props}/>
    }
    />
    )
}

const mapStateProtected = (state) => ({
  loggedIn: Boolean(state.session.user_id),
});


export const ProtectedRoute = withRouter(connect(
  mapStateProtected,
  null
)(Protected));

export const AuthRoute = withRouter(connect(
  mapStateProtected,
  null
)(Auth));
