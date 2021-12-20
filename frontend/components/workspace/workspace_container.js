import { connect  } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Workspace from './workspace';
import { logout } from '../../actions/session_actions';
import { loadChannel } from '../../actions/channel_actions';
import { getWorkspace } from '../../actions/workspace_actions';
import { getMessages } from '../../actions/message_actions';
import { updateOtherUserChannelStatus, updateOtherUserWorkspaceStatus } from '../../actions/user_actions';

const mapStateToProps = (state, ownProps) => ({
  workspaces: Object.values(state.entities.workspaces),
  workspace_address: ownProps.match.params.workspace_address,
  channel_id: parseInt(ownProps.match.params.channel_id),
  users: state.entities.users,
  user_id: state.session.user_id
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  getWorkspace: (workspace_address) => dispatch(getWorkspace(workspace_address)),
  loadChannel: (channel_id) => dispatch(loadChannel(channel_id)),
  updateOtherUserWorkspaceStatus: (userData) => dispatch(updateOtherUserWorkspaceStatus(userData)),
  updateOtherUserChannelStatus: (userData) => dispatch(updateOtherUserChannelStatus(userData))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Workspace))