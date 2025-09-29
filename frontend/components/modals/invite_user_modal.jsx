import React from 'react';
import { hideElements } from '../../util/modal_api_util';
import { inviteUser } from '../../util/connection_api_util';

import { withRouter } from '../../withRouter';

class InviteUserModal extends React.Component {
  constructor() {
    super();

    this.state = {
      name: "",
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
      return (<button disabled>Create</button>)
    else
      return (<button onClick={this.submitForm}>Create</button>)
  }

  warning() {
    return (<h2 className="orange">{this.state.error}</h2>)
  }

  // updates a field, and either enables or disables the button
  updateField(type) {
    return (e) => {
      if (e.currentTarget.value === "")
        this.setState({ [type]: e.currentTarget.value, disabled: true, error: "Email can't be blank." })
      else
        this.setState({ [type]: e.currentTarget.value, disabled: false, error: "" })
    }
  }

  // submits the information, and creates something
  submitForm(e) {
    e.preventDefault();

    inviteUser(this.state.name, this.props.params.workspace_address)
      .then(
        () => {
          this.setState({ name: "", disabled: true, error: "User Added!" });
        },
        ({responseJSON}) => this.setState({ error: responseJSON[0], disabled: true })
      )
  }

  // form this modal will output
  modalForm() {
    return (
      <div className="create-form" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h1>Add people</h1>
          <div className="modal-close-button" onClick={() => hideElements("invite-user-modal")}>&#10005;</div>
        </div>        
        <h6>
          Add your teammates to this workspace and start collaborating now!
          Only teammates with a Slock account can be added.
        </h6>
        <div className="create-form-header">
          <h2>To:</h2>
          {this.warning()}
        </div>
        <div className="channel-name-input">
          <input
            type="text" id="invite-user-input"
            onChange={this.updateField('name')}
            placeholder="name@gmail.com"
            value={this.state.name}></input>
        </div>

        {this.button()}
      </div>
    )
  }

  render() {
    return (
      <div className="invite-user-modal hidden">
        <div className="part-modal-background" onClick={() => { hideElements("invite-user-modal"); this.setState({ name: "" }) } }></div>
        {this.modalForm()}
      </div>
    )
  }
}

export default withRouter(InviteUserModal);