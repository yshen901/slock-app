import { connect } from 'react-redux';
import { signup, HOME_WORKSPACE } from '../../actions/session_actions';
import { withRouter } from 'react-router-dom';
import UserAuthForm from './user_auth_form'

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