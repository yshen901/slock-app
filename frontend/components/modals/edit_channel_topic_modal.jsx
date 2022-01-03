import React from 'react';
import { withRouter } from 'react-router-dom';
import { hideElements } from '../../util/modal_api_util';
import { updateChannel } from '../../actions/channel_actions';

class EditChannelTopicModal extends React.Component {
  constructor(props) {
    super(props);

    let channel = getState().entities.channels[props.match.params.channel_id];
    this.state = {
      topic: channel ? channel.topic : "",
      disabled: true,
      error: "",
      channel
    }

    this.modalForm = this.modalForm.bind(this);
    this.updateField = this.updateField.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidUpdate(oldProps) {
    let {channel_id} = this.props.match.params;

    // Ignore changes during channel transition, and ignore invalid channels
    if (channel_id != "0" && channel_id !== oldProps.match.params.channel_id) {
      if (getState().entities.channels[channel_id])
        this.setState({topic: getState().entities.channels[channel_id].topic})
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    let {channel_id} = this.props.match.params;
    this.setState({topic: getState().entities.channels[channel_id].topic});
    hideElements("edit-channel-topic-modal");
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
        this.setState({ [type]: e.currentTarget.value, disabled: true, error: `(${250 - e.currentTarget.value.length}) Topic must be 250 characters or less.` })
      else
        this.setState({ [type]: e.currentTarget.value, disabled: false, error: "" })
    }
  }

  // submits the information, and updates channel
  submitForm(e) {
    e.preventDefault();

    dispatch(updateChannel({ topic: this.state.topic, id: this.props.match.params.channel_id }))
      .then(
        () => {
          this.setState({ topic: this.state.topic, disabled: true, error: "" });
          hideElements("edit-channel-topic-modal");
        }
      )
  }

  // form this modal will output
  modalForm() {
    return (
      <div id="channel-topic-form" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h1>Edit topic</h1>
          <div className="modal-close-button" onClick={this.handleCancel}>&#10005;</div>
        </div>
        <div className="channel-form-header">
          {this.warning()}
        </div>
        <textarea
          type="text" id="channel-topic-input"
          onChange={this.updateField('topic')}
          value={this.state.topic}></textarea>
        <div className="channel-form-footer">
          <div>Let people know what <strong>#{this.state.channel.name}</strong> is focused on right now (ex. a project milestone).</div>
          <div>Topics are always visible in the header.</div>
        </div>
        {this.button()}
      </div>
    )
  }

  render() {
    return (
      <div className="edit-channel-topic-modal darker hidden">
        <div className="part-modal-background" onClick={this.handleCancel}></div>
        {this.modalForm()}
      </div>
    )
  }
}

export default withRouter(EditChannelTopicModal);