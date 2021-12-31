import { withRouter } from "react-router";
import { connect } from "react-redux";
import { updateChannelUser } from "../../actions/channel_actions";
import ChannelDetailsModal from "./channel_details_modal";
import { sortedChannelUsers } from "../../selectors/selectors";

const mapStateToProps = (state, ownProps) => {
  let { channels, users } = state.entities;
  let { channel_id, user_id } = state.session;

  return {
    channel_id,
    channel: channels[channel_id],
    channel_users: sortedChannelUsers(channels[channel_id], users),
    current_user_id: user_id
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateChannelUser: (channel_user) => dispatch(updateChannelUser(channel_user))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChannelDetailsModal)
)