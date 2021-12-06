import React from "react";
import { hideElements } from "../../util/modal_api_util";

class EditProfileModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: "",
      imageFile: null,
      errors: []
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
    this.setState({imageUrl: "", imageFile: null, errors: []});
    hideElements("edit-profile-modal");
  }

  // Reads in the elements using FileReader, and set state when successful
  readFile(e) {
    const reader = new FileReader();
    const file = e.currentTarget.files[0];

    // Triggers when a file is done
    reader.onloadend = () => {
      if (file.type === "image/jpeg" || file.type === "image/png") 
        this.setState({ imageUrl: reader.result, imageFile: file, errors: [] });
      else
        this.setState({ errors: ["Invalid file format: files must be jpg or png.", ...this.state.errors]})
    };

    if (file) 
      reader.readAsDataURL(file); // Triggers load
    else
      this.setState({ imageUrl: "", imageFile: null })
  }

  photoUrl() {
    if (this.state.imageFile)
      return this.state.imageUrl;
    else if (this.props.user.photo_url)
      return this.props.user.photo_url;
    else 
      return "/images/profile/default.jpg";
  }

  submitButton() {
    if (this.state.errors.length == 0)
      return <button className="green-button" onClick={this.handleUpload}>Save</button>
    else
      return <button className="green-button" disabled onClick={this.handleUpload}>Save</button>
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
          { this.submitButton() }
        </div>
        <div className="form-errors">
          { this.state.errors.map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="edit-profile-modal hidden">
        <div className="part-modal-background" onClick={() => hideElements("edit-profile-modal")}></div>
        { this.modalForm() }
      </div>
    );
  }
}

export default EditProfileModal;