import { connect } from 'react-redux';
import { signup, HOME_WORKSPACE } from '../../actions/session_actions';
import { withRouter } from 'react-router-dom';
import UserAuthForm from './user_auth_form'


/* TODO: Remove need for a "default" server for signup
         ... more research into how slack actually works is required
*/
const mapStateToProps = (state) => ({
  formType: "Sign Up",
  workspace_address: HOME_WORKSPACE,
});

const mapDispatchToProps = (dispatch) => ({
  processForm: (user) => dispatch(signup(user))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAuthForm))