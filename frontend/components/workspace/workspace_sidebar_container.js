import { connect } from 'react-redux';

import WorkspaceSidebar from './workspace_sidebar';
import { endDmChannel } from '../../actions/dm_channel_actions';

const mapStateToProps = (state, ownProps) => ({
  user: state.entities.users[state.session.user_id],
  users: state.entities.users,
  channels: state.entities.channels,
  user_channels: Object.keys(state.session.user_channels),

  workspace_address: ownProps.match.params.workspace_address,
  channel_id: parseInt(ownProps.match.params.channel_id),
})

const mapDispatchToProps = (dispatch) => ({
  endDmChannel: (dmChannelInfo) => dispatch(endDmChannel(dmChannelInfo))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceSidebar)




