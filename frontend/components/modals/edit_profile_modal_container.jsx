import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import EditProfileModal from "./edit_profile_modal";

import { updateUser } from "../../actions/user_actions";

const mapStateToProps = (state, ownProps) => {
  let userId = state.session.user_id;
  return {
    user: state.entities.users[userId]
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateUser: user => dispatch(updateUser(user))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditProfileModal)
)