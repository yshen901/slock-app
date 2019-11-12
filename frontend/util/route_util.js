import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';
import { objectToArray } from '../selectors/selectors';

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

const Workspace = ({ component: Component, path, loggedIn, exact }) => {
  return (
    <Route
      path={path}
      exact={exact}
      render= { 
        props => {
          debugger;
          if (!props.loggedIn)
            <Redirect to="/signin" />
          else {
            
          }
        }
      }
    />
  );
}

const mapStateProtected = (state) => ({
  loggedIn: Boolean(state.session.user_id),
});

const mapStateWorkspace = (state) => ({
  loggedIn: Boolean(state.session.user_id),
  workspaces: state.entities.workspaces,
});

export const ProtectedRoute = withRouter(connect(
  mapStateProtected,
  null
)(Protected));

export const WorkspaceRoute = withRouter(connect(
  mapStateWorkspace,
  null
)(Workspace));