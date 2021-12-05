import React from "react";
import { hideElements } from "../../util/modal_api_util";

class EditProfileModal extends React.Component {
  constructor(props) {
    super(props);
  }

  modalForm() {
    return (
      <div id="edit-profile-modal-form">
        <h1>Edit your profile</h1>
        <div className="form-content">
          <div className="info">
            <h2>Name</h2>
            <input type="text"/>
          </div>
          <div className="photo">
            <h2>Profile Photo</h2>
            <div className="img-container">
              <img src={this.props.user.photo_url} alt=""/>
            </div>
            <button>Upload Photo</button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="edit-profile-modal">
        <div className="part-modal-background" onClick={() => hideElements("edit-profile-modal")}></div>
        { this.modalForm() }
      </div>
    );
  }
}

export default EditProfileModal;