import React from "react";
import { hideElements } from "../../util/modal_api_util";

class EditProfileModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: "",
      imageFile: null
    };

    this.resetState = this.setState.bind(this);
    this.readFile = this.readFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  // Fires backend to update the user's attached photo
  handleUpload(e) {
    e.stopPropagation();
    let { imageFile } = this.state;

    // Necessary for uploading files
    let userForm = new FormData();
    userForm.append('id', this.props.user.id)

    if (imageFile) {
      userForm.append('user[photo]', imageFile); // Nested!
      this.props.updateUser(userForm)
        .then(() => {
          this.handleCancel();
        });
    } 
    else {
      this.handleCancel();
    }
  }

  // Resets state and hides modal
  handleCancel() {
    this.setState({imageUrl: "", imageFile: null});
    hideElements("edit-profile-modal");
  }

  // Reads in the elements using FileReader, and set state when successful
  readFile(e) {
    const reader = new FileReader();
    const file = e.currentTarget.files[0];

    // Triggers when a file is done
    reader.onloadend = () => {
      this.setState({ imageUrl: reader.result, imageFile: file });
    };

    if (file) 
      reader.readAsDataURL(file); // Triggers load
    else
      this.setState({ imageUrl: "", imageFile: file })
  }

  photoUrl() {
    if (this.state.imageFile)
      return this.state.imageUrl;
    else
      return this.props.user.photo_url;
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
              <img src={this.photoUrl()} alt=""/>
            </div>
            <input 
              type="file" 
              id="selected-file"
              style={{display: "none"}}
              onChange={this.readFile}/>
            <input type="button" value="Upload File" onClick={() => document.getElementById('selected-file').click()} />
          </div>
        </div>
        <div className="form-buttons">
          <button onClick={this.handleCancel}>Cancel</button>
          <button className="green-button" onClick={this.handleUpload}>Save</button>
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