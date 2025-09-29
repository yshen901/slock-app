import React from 'react';
import { hideElements } from '../../util/modal_api_util';
import { updateChannel } from '../../actions/channel_actions';

import { withRouter } from "../../withRouter"

class EditChannelDescriptionModal extends React.Component {
  constructor(props) {
    super(props);

    let channel = getState().entities.channels[props.params.channel_id];
    this.state = {
      description: channel ? channel.description : "",
      disabled: true,
      error: ""
    }

    this.modalForm = this.modalForm.bind(this);
    this.updateField = this.updateField.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidUpdate(oldProps) {
    let {channel_id} = this.props.params;

    // Ignore changes during channel transition, and ignore invalid channels
    if (channel_id != "0" && channel_id !== oldProps.params.channel_id) {
      if (getState().entities.channels[channel_id])
        this.setState({description: getState().entities.channels[channel_id].description})
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    let {channel_id} = this.props.params;
    this.setState({description: getState().entities.channels[channel_id].description});
    hideElements("edit-channel-description-modal");
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
      if (e.currentTarget.value.length >= 250)
        this.setState({ [type]: e.currentTarget.value, disabled: true, error: `(${250 - e.currentTarget.value.length}) Description must be 250 characters or less.` })
      else
        this.setState({ [type]: e.currentTarget.value, disabled: false, error: "" })
    }
  }

  // submits the information, and updates channel
  submitForm(e) {
    e.preventDefault();

    dispatch(updateChannel({ description: this.state.description, id: this.props.params.channel_id }))
      .then(
        () => {
          this.setState({ description: this.state.description, disabled: true, error: "" });
          hideElements("edit-channel-description-modal");
        }
      )
  }

  // form this modal will output
  modalForm() {
    return (
      <div id="channel-description-form" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h1>Edit description</h1>
          <div className="modal-close-button" onClick={this.handleCancel}>&#10005;</div>
        </div>
        <div className="channel-form-header">
          {this.warning()}
        </div>
        <textarea
          type="text" id="channel-description-input"
          onChange={this.updateField('description')}
          value={this.state.description}></textarea>
        <div className="channel-form-footer">
          <div>Let people know what this channel is for.</div>
        </div>
        {this.button()}
      </div>
    )
  }

  render() {
    return (
      <div className="edit-channel-description-modal darker hidden">
        <div className="part-modal-background" onClick={this.handleCancel}></div>
        {this.modalForm()}
      </div>
    )
  }
}

export default EditChannelDescriptionModal;