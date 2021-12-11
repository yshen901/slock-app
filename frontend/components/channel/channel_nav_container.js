import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ChannelNav from './channel_nav';


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
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelNav))