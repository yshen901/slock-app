import { connect } from 'react-redux';

import ChannelNav from './channel_nav';
import { updateChannelUser } from "../../actions/channel_actions";

const mapStateToProps = (state, ownProps) => {
  let { channel_id, workspace_address } = ownProps.match.params;
  let { users, channels } = state.entities;
  let { user_id } = state.session;
  return {
    channel_id: parseInt(channel_id),
    channel: channels[parseInt(channel_id)],
    user: users[user_id],
    users: users,
    workspace_address: workspace_address,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateChannelUser: (channel_user) => dispatch(updateChannelUser(channel_user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelNav)