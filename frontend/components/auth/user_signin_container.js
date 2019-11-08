import { connect } from 'react-redux';
import { login } from '../../actions/session_actions';
import { getWorkspace } from '../../actions/workspace_actions';
import { withRouter } from 'react-router-dom';
import UserAuthForm from './user_auth_form'

/* NOTE: How to access the link params (/signin/:workspace_address)
            ...must use withRouter to be able to access
*/
const mapStateToProps = (state, ownProps) => ({
  formType: "Sign In",
  workspace_address: ownProps.match.params.workspace_address,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  processForm: (user) => dispatch(login(user)),
  getWorkspace: (workspace_address) => dispatch(getWorkspace(workspace_address))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAuthForm))