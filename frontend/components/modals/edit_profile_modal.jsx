import React from "react";
import { hideElements } from "../../util/modal_api_util";
import { photoUrl } from "../../selectors/selectors";

class EditProfileModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: "",
      imageFile: null,
      errors: [],
      full_name: "",
      display_name: "",
      what_i_do: "",
      phone_number: ""
    };

    this.resetState = this.setState.bind(this);
    this.readFile = this.readFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let { full_name, display_name, what_i_do, phone_number } = this.props.user;
    this.setState({
      full_name, 
      display_name,
      what_i_do,
      phone_number
    });
  }

  // Fires backend to update the user's attached photo
  handleUpload(e) {
    e.stopPropagation();
    let { imageFile, full_name, display_name, what_i_do, phone_number } = this.state;

    // Necessary for uploading files
    let userForm = new FormData();
    userForm.append('id', this.props.user.id)

    if (imageFile)
      userForm.append('user[photo]', imageFile); // Nested!
    userForm.append('user[full_name]', full_name); // Nested!
    userForm.append('user[display_name]', display_name); // Nested!
    userForm.append('user[what_i_do]', what_i_do); // Nested!
    userForm.append('user[phone_number]', phone_number); // Nested!

    this.props.updateUser(userForm)
    .then(() => {
      this.handleCancel();
    });
  }

  // Resets state and hides modal
  handleCancel() {
    this.setState({imageUrl: "", imageFile: null, errors: []});
    hideElements("edit-profile-modal");
  }

  // Updates the field
  // Special case for phone number where it will insert dashes at the right places
  handleChange(type) {
    return (e) => {
      if (type != "phone_number")
        this.setState({
          [type]: e.currentTarget.value
        });
      else {
        let number = e.currentTarget.value;
        number = number.split("").filter((char) => parseInt(char)).join("");
        this.setState({
          [type]: number.slice(0, 10)
        });
      }
    }
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
        this.setState({ errors: ["Invalid file format: profile photos must be jpg or png.", ...this.state.errors]})
    };

    if (file) 
      reader.readAsDataURL(file); // Triggers load
    else
      this.setState({ imageUrl: "", imageFile: null })
  }

  photoUrl() {
    if (this.state.imageFile)
      return this.state.imageUrl;
    else
      return photoUrl(this.props.user);
  }

  submitButton() {
    // if (this.state.errors.length != 0)
    //   return <button className="green-button" disabled onClick={this.handleUpload}>Save</button>
    // else
      return <button className="green-button" onClick={this.handleUpload}>Save</button>
  }

  modalForm() {
    return (
      <div id="edit-profile-modal-form">
        <div className="modal-header">
          <h1>Edit your profile</h1>
          <div className="modal-close-button" onClick={() => hideElements("edit-profile-modal")}>&#10005;</div>
        </div>
        <div className="form-content">
          <div className="info">
            <h2>Full Name</h2>
            <input type="text" value={this.state.full_name} onChange={this.handleChange("full_name")}/>
            <h2>Display Name</h2>
            <input type="text" value={this.state.display_name} onChange={this.handleChange("display_name")}/>
            <h2>Phone Number</h2>
            <input type="text" value={this.state.phone_number} onChange={this.handleChange("phone_number")}/>
            <h2>What I Do</h2>
            <input type="text" value={this.state.what_i_do} onChange={this.handleChange("what_i_do")}/>
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