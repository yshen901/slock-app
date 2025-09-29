import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Navigate } from 'react-router-dom';

import { withRouter } from '../withRouter';

/* NOTE: How to create routes with additional conditions (i.e. Protected/Auth) */
// const Protected = ({ component: Component, path, loggedIn, exact }) => {
//   return (
//     <Route
//       path={path}
//       exact={exact}
//       render= { 
//         props => !loggedIn ? <Redirect to="/signin" /> : <Component {...props} />
//       }
//     />
//   );
// }

// removed props, since component can use withLocation, withNavigation, etc
// removed exact, since all are exact now
// changed render to element
const Protected = ({ component: Component, path, loggedIn }) => {
  return (
    <Route
      path={path}
      element= { 
        !loggedIn ? <Navigate to="/signin" /> : <Component /> 
      }
    />
  );
}

// const Auth = ({ component: Component, path, loggedIn, exact }) => {
//   return (
//     <Route 
//     path={path}
//     exact={exact}
//     render={
//       props => loggedIn ? <Redirect to="/"/> : <Component {...props}/>
//     }
//     />
//     )
// }
const Auth = ({ component: Component, path, loggedIn }) => {
  return (
    <Route 
    path={path}
    element={
      loggedIn ? <Navigate to="/"/> : <Component />
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
