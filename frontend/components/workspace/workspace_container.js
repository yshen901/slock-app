import { connect  } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Workspace from './workspace';
import { logout } from '../../actions/session_actions';
import { getWorkspace } from '../../actions/workspace_actions';
import { objectToArray } from '../../selectors/selectors';

const mapStateToProps = (state, ownProps) => ({
  user: state.entities.users[state.session.user_id],
  workspace_address: ownProps.match.params.workspace_address,
  channels: objectToArray(state.entities.channels)
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  getWorkspace: (workspaceId) => dispatch(getWorkspace(workspaceId))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Workspace))