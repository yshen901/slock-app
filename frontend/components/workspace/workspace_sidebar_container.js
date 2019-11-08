import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import WorkspaceSidebar from './workspace_sidebar';
import { objectToArray } from '../../selectors/selectors';
import { logout } from '../../actions/session_actions';

const mapStateToProps = (state, ownProps) => ({
  user: state.entities.users[state.session.user_id],
  workspace_address: ownProps.match.params.workspace_address,
  channels: objectToArray(state.entities.channels),
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout())
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceSidebar))




