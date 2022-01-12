import { withRouter } from "react-router";
import { connect } from "react-redux";
import { updateChannelUser } from "../../actions/channel_actions";
import ChannelDetailsModal from "./channel_details_modal";
import { sortedChannelUsers } from "../../selectors/selectors";
import { updateDmChannel } from "../../actions/dm_channel_actions";

const mapStateToProps = (state, ownProps) => {
  let { channels, users } = state.entities;
  let { user_id } = state.session;
  let { channel_id } = ownProps.match.params;

  return {
    channel_id,
    channel: channels[channel_id],
    users,
    channel_users: sortedChannelUsers(channels[channel_id], users),
    current_user_id: user_id,

    workspace_address: ownProps.match.params.workspace_address,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateChannelUser: (channel_user) => dispatch(updateChannelUser(channel_user)),
  updateDmChannelUser: (dm_channel_user) => dispatch(updateDmChannel(dm_channel_user))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChannelDetailsModal)
)