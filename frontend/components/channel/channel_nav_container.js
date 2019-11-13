import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ChannelNav from './channel_nav';


const mapStateToProps = (state, ownProps) => ({
  workspace_address: ownProps.match.params.workspace_address,
  channel_id: parseInt(ownProps.match.params.channel_id),
  channel: state.entities.channels[ownProps.match.params.channel_id],
})

const mapDispatchToProps = (dispatch) => ({
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelNav))