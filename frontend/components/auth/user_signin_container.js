import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import UserAuthForm from './user_auth_form'

import { login } from '../../actions/session_actions';
import { findWorkspace, getWorkspace } from '../../actions/workspace_actions';
import { getChannels } from '../../actions/channel_actions';
import { refreshErrors } from '../../actions/error_actions';

/* NOTE: How to access the link params (/signin/:workspace_address)
            ...must use withRouter to be able to access
*/
const mapStateToProps = (state, ownProps) => ({
  formType: "Sign In",
  workspace_address: ownProps.match.params.workspace_address,
  error_message: "Sorry, you entered an incorrect email address or password.",
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  processForm: (user) => dispatch(login(user)),
  getWorkspace: (workspace_address) => dispatch(getWorkspace(workspace_address)),
  getChannels: (workspace_id) => dispatch(getChannels(workspace_id)),
  findWorkspace: (workspace_address) => dispatch(findWorkspace(workspace_address)),
  refreshErrors: () => dispatch(refreshErrors())
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAuthForm))