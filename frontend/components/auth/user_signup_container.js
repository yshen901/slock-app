import { connect } from 'react-redux';
import { signup, HOME_WORKSPACE } from '../../actions/session_actions';
import { getWorkspace } from '../../actions/workspace_actions';
import { withRouter } from 'react-router-dom';
import UserAuthForm from './user_auth_form'


/* TODO3: Remove need for a "default" server for signup
         ... more research into how slack actually works is required
*/
const mapStateToProps = (state) => ({
  formType: "Sign Up",
  workspace_address: HOME_WORKSPACE,
});

const mapDispatchToProps = (dispatch) => ({
  processForm: (user) => dispatch(signup(user)),
  getWorkspace: (workspace_address) => dispatch(getWorkspace(workspace_address))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAuthForm))