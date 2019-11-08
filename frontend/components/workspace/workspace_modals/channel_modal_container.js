import { connect } from 'react-redux';
import { objectToArray } from '../../../selectors/selectors';
import Modal from './modal';

const mapStateToProps = (state, ownProps) => ({
  modalInfo: objectToArray(state.entities.channels),
  modalClass: `modal channel-modal ${ownProps.hidden}`,
})

// TODO1: CREATE AN ACTION HERE THAT AFTER CLICKING A CHANNEL WILL ADD IT TO THE LIST
//       OF A CONNECTION'S CHANNELS. ALSO NEED TO MIGRATE THE JOINS TABLE THAT
//       STORES A CONNECTION'S CHANNELS.
const mapDispatchToProps = (dispatch) => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);