import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ChannelChatRoom from './channel_chat_room';
import { getMessages } from '../../actions/message_actions';

const mapStateToProps = (state, ownProps) => ({
  channel_id: ownProps.match.params.channel_id,
  users: state.entities.users,
  joinChannels: ownProps.joinChannels,
  status: ownProps.status
})

const mapDispatchToProps = dispatch => ({
  getMessages: (channel_id) => dispatch(getMessages(channel_id))
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelChatRoom))