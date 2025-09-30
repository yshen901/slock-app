import { connect } from "react-redux";
import { updateChannelUser } from "../../actions/channel_actions";
import ChannelDetailsModal from "./channel_details_modal";
import { sortedChannelUsers } from "../../selectors/selectors";
import { updateDmChannel } from "../../actions/dm_channel_actions";
import { deleteMessage, updateMessage } from "../../actions/message_actions";

import { withRouter } from "../../withRouter";

const mapStateToProps = (state, ownProps) => {
  let { channels, users, messages } = state.entities;
  let { user_id } = state.session;
  let { channel_id, workspace_address } = ownProps.params;

  return {
    users,
    channel: channels[channel_id],
    channel_users: sortedChannelUsers(channels[channel_id], users),
    messages,
    
    channel_id,
    workspace_address,
    current_user_id: user_id,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateChannelUser: (channel_user) => dispatch(updateChannelUser(channel_user)),
  updateDmChannelUser: (dm_channel_user) => dispatch(updateDmChannel(dm_channel_user)),
  updateMessage: (message) => dispatch(updateMessage(message)),
  deleteMessage: (message) => dispatch(deleteMessage(message))
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChannelDetailsModal))