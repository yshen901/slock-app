import React from "react";
import { hideElements } from "../../util/modal_api_util";

class EditProfileModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: "",
      imageFile: null
    };

    this.readFile = this.readFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleUpload(imageUrl, file) {
    let userForm = new FormData();
    userForm.append('user[photo]', file);
    userForm.append('id', this.props.user.id)

    this.props.updateUser(userForm)
      .then((user) => {
        this.setState({ imageUrl, file });
      });
  }

  readFile(e) {
    const reader = new FileReader();
    const file = e.currentTarget.files[0];

    reader.onloadend = () => {
      this.handleUpload(reader.result, file);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
    else {
      this.setState({ imageUrl: "", imageFile: null});  
    }
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
              onChange={this.readFile}/>
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