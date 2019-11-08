import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import WorkspaceSidebar from './workspace_sidebar';
import { objectToArray } from '../../selectors/selectors';

const mapStateToProps = (state, ownProps) => ({
  user: state.entities.users[state.session.user_id],
  workspace: state.entities.workspaces[ownProps.match.params.workspace_id],
  channels: objectToArray(state.entities.channels),
})

const mapDispatchToProps = (dispatch) => ({
  
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceSidebar))




