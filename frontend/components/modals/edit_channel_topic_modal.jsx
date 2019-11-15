import React from 'react';
import { withRouter } from 'react-router-dom';
import { hideElements } from '../../util/modal_api_util';
import { updateChannel } from '../../actions/channel_actions';

class EditChannelTopicModal extends React.Component {
  constructor(props) {
    super(props);

    let { description } = getState().entities.channels[props.match.params.channel_id];
    this.state = {
      topic: description ? description : "",
      disabled: true,
      error: ""
    }

    this.modalForm = this.modalForm.bind(this);
    this.updateField = this.updateField.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.button = this.button.bind(this);
    this.warning = this.warning.bind(this);
  }

  button() {
    if (this.state.disabled)
      return (<button disabled>Set Topic</button>)
    else
      return (<button onClick={this.submitForm}>Set Topic</button>)
  }

  warning() {
    return (<h2 className="orange">{this.state.error}</h2>)
  }

  // updates a field, and either enables or disables the button
  updateField(type) {
    return (e) => {
      if (e.currentTarget.value.length >= 250)
        this.setState({ [type]: e.currentTarget.value, disabled: true, error: "Topic must be 250 characters or less." })
      else
        this.setState({ [type]: e.currentTarget.value, disabled: false, error: "" })
    }
  }

  // submits the information, and updates channel
  submitForm(e) {
    e.preventDefault();

    dispatch(updateChannel({ description: this.state.topic, id: this.props.match.params.channel_id }))
      .then(
        () => {
          this.setState({ topic: "", disabled: true, error: "" });
          hideElements("edit-channel-topic-modal");
        }
      )
  }

  // form this modal will output
  modalForm() {
    return (
      <div id="channel-topic-form" onClick={e => e.stopPropagation()}>
        <h1>Edit channel topic</h1>
        <div className="channel-topic-form-header">
          {this.warning()}
        </div>
        <textarea
          type="text" id="channel-topic-input"
          onChange={this.updateField('topic')}
          value={this.state.topic}></textarea>
        {this.button()}
      </div>
    )
  }

  render() {
    return (
      <div className="edit-channel-topic-modal hidden">
        <div className="part-modal-background" onClick={() => hideElements("edit-channel-topic-modal")}></div>
        {this.modalForm()}
      </div>
    )
  }
}

export default withRouter(EditChannelTopicModal);