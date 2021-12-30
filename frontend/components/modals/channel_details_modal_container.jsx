import { withRouter } from "react-router";
import { connect } from "react-redux";
import { updateChannelUser } from "../../actions/channel_actions";
import ChannelDetailsModal from "./channel_details_modal";

const mapStateToProps = (state, ownProps) => ({
  channel_id: ownProps.match.params.channel_id,
  channel: state.entities.channels[ownProps.match.params.channel_id],
  users: state.entities.users,
  current_user_id: state.session.user_id
});

const mapDispatchToProps = (dispatch) => ({
  updateChannelUser: (channel_user) => dispatch(updateChannelUser(channel_user))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChannelDetailsModal)
)