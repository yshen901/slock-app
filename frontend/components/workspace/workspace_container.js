import { connect  } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Workspace from './workspace';
import { logout } from '../../actions/session_actions';
import { getWorkspace } from '../../actions/workspace_actions';
import { getChannels } from '../../actions/channel_actions';

const mapStateToProps = (state, ownProps) => ({
  workspace_address: ownProps.match.params.workspace_address,
  channel_id: parseInt(ownProps.match.params.channel_id),
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  getWorkspace: (workspace_address) => dispatch(getWorkspace(workspace_address)),
  getChannels: (workspace_id) => dispatch(getChannels(workspace_id))

});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Workspace))