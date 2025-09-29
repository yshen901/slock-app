import { connect } from 'react-redux';
import NewChannelModal from './new_channel_modal';
import { postChannel } from '../../actions/channel_actions';
import { objectToNameArray } from '../../selectors/selectors';

const mapStateToProps = (state, ownProps) => ({
  workspace_id: state.session.workspace_id,
  workspace_address: ownProps.match.params.workspace_address,
  channels: objectToNameArray(state.entities.channels),
})

const mapDispatchToProps = (dispatch) => ({
  postChannel: (channel) => dispatch(postChannel(channel))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewChannelModal);