import { connect  } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Workspace from './workspace';
import { logout } from '../../actions/session_actions'

const mapStateToProps = (state, ownProps) => ({
  workspace: getState().entities.workspaces[ownProps.match.params.workspace_id]
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout())
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Workspace))