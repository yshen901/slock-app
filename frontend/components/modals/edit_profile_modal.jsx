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
  }

  readFile(e) {
    const reader = new FileReader();
    const file = e.currentTarget.files[0];

    reader.onloadend = () => {
      this.setState({ imageUrl: reader.result, imageFile: file });
      
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