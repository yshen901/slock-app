import React from 'react';
import { withRouter } from 'react-router-dom';
import { hideElements } from '../../util/modal_api_util';
import { updateChannel } from '../../actions/channel_actions';

class EditChannelNameModal extends React.Component {
  constructor(props) {
    super(props);

    let channel = getState().entities.channels[props.match.params.channel_id];
    this.state = {
      name: channel ? channel.name : "",
      disabled: true,
      error: ""
    }

    this.modalForm = this.modalForm.bind(this);
    this.updateField = this.updateField.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.button = this.button.bind(this);
    this.warning = this.warning.bind(this);
  }

  componentDidUpdate(oldProps) {
    let {channel_id} = this.props.match.params;

    // Ignore changes during channel transition, and ignore invalid channels
    if (channel_id != "0" && channel_id !== oldProps.match.params.channel_id) {
      if (getState().entities.channels[channel_id])
        this.setState({name: getState().entities.channels[channel_id].name})
    }
  }

  button() {
    if (this.state.disabled)
      return (<button disabled>Save</button>)
    else
      return (<button onClick={this.submitForm}>Save</button>)
  }

  warning() {
    return (<h2 className="orange">{this.state.error}</h2>)
  }

  // updates a field, and either enables or disables the button
  updateField(type) {
    return (e) => {
      if (e.currentTarget.value.length >= 100)
        this.setState({ [type]: e.currentTarget.value, disabled: true, error: "Name must be 100 characters or less." })
      else
        this.setState({ [type]: e.currentTarget.value, disabled: false, error: "" })
    }
  }

  // submits the information, and updates channel
  submitForm(e) {
    e.preventDefault();

    dispatch(updateChannel({ name: this.state.name, id: this.props.match.params.channel_id }))
      .then(
        () => {
          this.setState({ name: this.state.name, disabled: true, error: "" });
          hideElements("edit-channel-name-modal");
        }
      )
  }

  // form this modal will output
  modalForm() {
    return (
      <div id="channel-name-form" onClick={e => e.stopPropagation()}>
        <h1>Edit name</h1>
        <div className="channel-name-form-header">
          {this.warning()}
        </div>
        <textarea
          type="text" id="channel-name-input"
          onChange={this.updateField('name')}
          value={this.state.name}></textarea>
        {this.button()}
      </div>
    )
  }

  render() {
    return (
      <div className="edit-channel-name-modal darker hidden">
        <div className="part-modal-background" onClick={() => hideElements("edit-channel-name-modal")}></div>
        {this.modalForm()}
      </div>
    )
  }
}

export default withRouter(EditChannelNameModal);