import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { startDmChannel } from '../../../actions/dm_channel_actions';
import PeopleBrowser from "./people_browser";

const mapStateToProps = (state, ownProps) => ({
  user_id: state.session.user_id,
  workspace_id: state.session.workspace_id,
  users: state.entities.users
});

const mapDispatchToProps = (dispatch) => ({
  startDmChannel: (dmChannelInfo) => dispatch(startDmChannel(dmChannelInfo)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PeopleBrowser)
);