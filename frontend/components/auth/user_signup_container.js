import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import UserAuthForm from './user_auth_form';

import { signup, DEMO_WORKSPACE } from '../../actions/session_actions';
import { findWorkspace, getWorkspaces } from '../../actions/workspace_actions';
import { refreshErrors } from '../../actions/error_actions';

/* TODO3: Remove need for a "default" server for signup
         ... more research into how slack actually works is required
*/
const mapStateToProps = (state) => ({
  formType: "Sign up",
  workspace_address: DEMO_WORKSPACE,
  error_message: "User already exists, please try again",
});

const mapDispatchToProps = (dispatch) => ({
  processForm: (user) => dispatch(signup(user)),
  getWorkspaces: () => dispatch(getWorkspaces()),
  findWorkspace: (workspace_address) => dispatch(findWorkspace(workspace_address)),
  refreshErrors: () => dispatch(refreshErrors())
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAuthForm))