import React from "react";
import { withRouter } from "react-router";
import { updateWorkspaceUser } from "../../actions/user_actions";
import { hideElements } from "../../util/modal_api_util";

class EditProfileStatusModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: ""
    };

    this.updateField = this.updateField.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    let { user_id } = getState().session;
    let user = getState().entities.users[user_id];
    this.setState({ status: user.status });
  }

  // updates a field, and either enables or disables the button
  updateField(e) {
    e.stopPropagation();
    this.setState({ status: e.currentTarget.value });
  }

  // handle cancel
  handleCancel(e) {
    if (e) e.stopPropagation();
    let { user_id } = getState().session;
    let user = getState().entities.users[user_id];

    this.setState({ status: user.status });
    hideElements("edit-profile-status-modal");
  }

  submitForm(e) {
    e.stopPropagation();
    let { workspace_id } = getState().session;
    dispatch(updateWorkspaceUser(workspace_id, {status: this.state.status}))
      .then(
        () => this.handleCancel()
      );
  }

  buttons() {
    let submitButton = (<button className="green-button" onClick={this.submitForm}>Save</button>);
    if (this.state.status.length > 100)
      submitButton = (<button disabled>Save</button>);
    let cancelButton = (<button onClick={ this.handleCancel }>Cancel</button>);

    return (
      <div className="form-buttons">
        { cancelButton }
        { submitButton }
      </div>
    )
  }

  render() {
    return (
      <div className="edit-profile-status-modal hidden">
        <div className="part-modal-background" onClick={ this.handleCancel }></div>
        <div className="create-form" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h1>Set a status</h1>
            <div className="modal-close-button" onClick={ this.handleCancel }>&#10005;</div>
          </div>                
          <div className="create-form-header">
            <h2 className="orange">{this.state.status.length > 100 ? "Status must be 100 characters or less." : ""}</h2>
          </div>
          <div className="channel-name-input">
            <div className="symbol gray">
              <i className="far fa-smile"></i>
            </div>
            <input 
              type="text" id="edit-profile-status-input"
              onChange={this.updateField}
              placeholder="What's your status?"
              value={this.state.status}></input>
            <div className="chars-left gray">{100 - this.state.status.length}</div>
          </div>
          {this.buttons()}
        </div>
      </div>
    )
  }
}

export default withRouter(EditProfileStatusModal);