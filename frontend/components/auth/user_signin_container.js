import { connect } from 'react-redux';
import UserAuthForm from './user_auth_form'

import { login } from '../../actions/session_actions';
import { findWorkspace, getWorkspaces } from '../../actions/workspace_actions';
import { refreshErrors } from '../../actions/error_actions';

import { withRouter } from '../../withRouter';

/* NOTE: How to access the link params (/signin/:workspace_address)
            ...must use withRouter to be able to access
*/
const mapStateToProps = (state, ownProps) => ({
  formType: "Sign in",
  workspace_address: ownProps.params.workspace_address,
  error_messages: ["Invalid username/password. Please try again or contact workspace owner."],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  processForm: (user) => dispatch(login(user)),
  getWorkspaces: () => dispatch(getWorkspaces()),
  findWorkspace: (workspace_address) => dispatch(findWorkspace(workspace_address)),
  refreshErrors: () => dispatch(refreshErrors())
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAuthForm))