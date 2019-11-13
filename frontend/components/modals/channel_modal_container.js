import { connect } from 'react-redux';
import FullModal from './full_modal';

import { objectToArray } from '../../selectors/selectors';

const mapStateToProps = (state, ownProps) => ({
  modalInfo: objectToArray(state.entities.channels),
  modalClass: "full-modal channel-modal hidden",
})

// TODO1: CREATE AN ACTION HERE THAT AFTER CLICKING A CHANNEL WILL ROUTE TO THAT CHANNEL
const mapDispatchToProps = (dispatch) => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FullModal);