import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import EditProfileModal from "./edit_profile_modal";

const mapStateToProps = (state, ownProps) => {
  let userId = state.session.user_id;
  return {
    user: state.entities.users[userId]
  };
};

const mapDispatchToProps = (dispatch) => ({
  
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditProfileModal)
)