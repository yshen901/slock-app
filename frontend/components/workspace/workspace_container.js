import { connect  } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Workspace from './workspace';
import { logout } from '../../actions/session_actions';
import { loadChannel } from '../../actions/channel_actions';
import { getWorkspace } from '../../actions/workspace_actions';
import { getMessages } from '../../actions/message_actions';
import { updateOtherUserChannelStatus, updateOtherUserWorkspaceStatus, updateWorkspaceUser } from '../../actions/user_actions';
import { restartDmChannel } from '../../actions/dm_channel_actions';

const mapStateToProps = (state, ownProps) => ({
  workspaces: Object.values(state.entities.workspaces),
  workspace_address: ownProps.match.params.workspace_address,
  workspace_id: state.session.workspace_id,
  channel_id: ownProps.match.params.channel_id,
  channels: state.entities.channels,
  user: state.entities.users[state.session.user_id],
  users: state.entities.users,
  user_id: state.session.user_id,
  user_channel_ids: Object.keys(state.session.user_channels),
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  getWorkspace: (workspace_address) => dispatch(getWorkspace(workspace_address)),
  loadChannel: (channel_id) => dispatch(loadChannel(channel_id)),
  restartDmChannel: (channelInfo) => dispatch(restartDmChannel(channelInfo)), 
  updateWorkspaceUser: (workspace_id, workspace_user) => dispatch(updateWorkspaceUser(workspace_id, workspace_user)),
  updateOtherUserWorkspaceStatus: (userData) => dispatch(updateOtherUserWorkspaceStatus(userData)),
  updateOtherUserChannelStatus: (userData) => dispatch(updateOtherUserChannelStatus(userData))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Workspace))