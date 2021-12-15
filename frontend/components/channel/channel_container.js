import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { restartDmChannel } from '../../actions/dm_channel_actions';

import Channel from './channel';

const mapStateToProps = (state, ownProps) => ({
  workspace_address: ownProps.match.params.workspace_address,
  channel_id: parseInt(ownProps.match.params.channel_id),
  channel: state.entities.channels[ownProps.match.params.channel_id],
  user: state.entities.users[state.session.user_id],
  user_channel_ids: Object.keys(state.session.user_channels)
})

const mapDispatchToProps = (dispatch) => ({
  restartDmChannel: (dmChannelInfo) => dispatch(restartDmChannel(dmChannelInfo))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Channel))