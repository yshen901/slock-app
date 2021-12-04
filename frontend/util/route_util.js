import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';

/* NOTE: How to create routes with additional conditions (i.e. Protected/Auth)
*/

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

const mapStateProtected = (state) => ({
  loggedIn: Boolean(state.session.user_id),
});

export const ProtectedRoute = withRouter(connect(
  mapStateProtected,
  null
)(Protected));