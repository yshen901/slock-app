import React from "react";
import { hideElements } from "../../util/modal_api_util";
import { DEFAULT_PHOTO_URL } from "../../selectors/selectors";
import { timeZones } from "../../util/user_api_util";
// import imageCompression from 'browser-image-compression';
// import { compressImageFile } from 'frontend-image-compress';
import { compress } from "image-conversion";

class EditProfileModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: "",
      imageFile: null,
      deleteImage: false, // if true, will upload blank imageFile
      loadingFile: false,
      full_name: "",
      display_name: "",
      what_i_do: "",
      phone_number: "",
      timezone_offset: 0,
      errors: {
        full_name: "",
        imageFile: ""
      }
    };

    this.resetState = this.setState.bind(this);
    this.readFile = this.readFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let { full_name, display_name, what_i_do, phone_number, timezone_offset } = this.props.user;
    this.setState({
      full_name, 
      display_name,
      what_i_do,
      phone_number,
      timezone_offset
    });
  }

  // Fires backend to update the user's attached photo
  handleUpload(e) {
    e.stopPropagation();
    let { deleteImage, imageFile, full_name, display_name, what_i_do, phone_number, timezone_offset } = this.state;

    // Necessary for uploading files
    let userForm = new FormData();
    userForm.append('id', this.props.user.id)

    if (deleteImage)
      userForm.append('user[photo]', null);
    else if (imageFile)
        userForm.append('user[photo]', imageFile)

    userForm.append('user[full_name]', full_name); // Nested!
    userForm.append('user[display_name]', display_name); // Nested!
    userForm.append('user[what_i_do]', what_i_do); // Nested!
    userForm.append('user[phone_number]', phone_number); // Nested!
    userForm.append('user[timezone_offset]', timezone_offset); // Nested!

    this.props.updateUser(userForm)
      .then(() => {
        this.props.loginACChannel.speak({
          workspace_data: {
            user: this.props.user,
            logged_in: true,
            user_channel_ids: this.props.user_channel_ids,
            workspace_id: this.props.workspace_id
          }
        });
        this.handleCancel();
      });
  }

  // Resets state and hides modal
  handleCancel(e) {
    if (e) e.stopPropagation();
    let { full_name, display_name, what_i_do, phone_number, timezone_offset } = this.props.user;

    this.setState({
      imageUrl: "", 
      imageFile: null, 
      errors: [],
      full_name, 
      display_name,
      what_i_do,
      phone_number,
      timezone_offset
    });
    hideElements("edit-profile-modal");
  }

  // Updates the field
  // Special case for phone number where it will insert dashes at the right places
  handleChange(type) {
    return (e) => {
      if (type == "full_name") {
        this.setState({
          [type]: e.currentTarget.value,
          errors: Object.assign(this.state.errors, { full_name: e.currentTarget.value ? "" : "Full name can't be left blank!" })
        });
      }
      else if (type != "phone_number")
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
      if (file.type === "image/jpeg" || file.type === "image/png") {
        this.setState({loadingFile: true});
        if (file.size < 200000)
          this.setState({ loadingFile: false, deleteImage: false, imageUrl: URL.createObjectURL(file), imageFile: file, errors: Object.assign(this.state.errors, {imageFile: ""}) });
        else if (file.size < 20000000) { 
          let compressionRate = 0.1;
          if (file.type == "image/png")
            compressionRate = 0.3;
          compress(file, compressionRate)
            .then((data) => {
              this.setState({ loadingFile: false, deleteImage: false, imageUrl: URL.createObjectURL(data), imageFile: new File([data], data.name), errors: Object.assign(this.state.errors, {imageFile: ""}) });
            })
        }
        else {
          this.setState({ errors: Object.assign(this.state.errors, {imageFile: "Invalid file format: profile photos must be 20MB or smaller."})})
        }
      }
      else {
        this.setState({ errors: Object.assign(this.state.errors, {imageFile: "Invalid file format: profile photos must be jpg or png."})})
      }
    };

    if (file) 
      reader.readAsDataURL(file); // Triggers load
    else
      this.setState({ 
        imageUrl: this.state.imageUrl ? this.state.imageUrl : "", 
        imageFile: this.state.imageFile ? this.state.imageFile : null 
      });
  }

  photoUrl() {
    if (this.state.imageFile && !this.state.deleteImage)
      return this.state.imageUrl;
    else if (this.state.deleteImage)
      return DEFAULT_PHOTO_URL;
    else
      return this.props.user.photo_url;
  }

  submitButton() {
    if (this.state.errors.full_name)
      return <button className="green-button" disabled onClick={this.handleUpload}>Save</button>
    else
      return <button className="green-button" onClick={this.handleUpload}>Save</button>
  }

  modalForm() {
    return (
      <div id="edit-profile-modal-form">
        <div className="modal-header">
          <h1>Edit your profile</h1>
          <div className="modal-close-button" onClick={this.handleCancel}>&#10005;</div>
        </div>
        <div className="form-content">
          <div className="info">
            <h2>Full Name</h2>
            <input type="text" value={this.state.full_name} onChange={this.handleChange("full_name")} placeholder="Full Name"/>
            <h4></h4>

            <h2>Display Name</h2>
            <input type="text" value={this.state.display_name} onChange={this.handleChange("display_name")} placeholder="Display Name"/>
            <h4>This could be your first name, or a nickname — however you’d like people to refer to you in Slack.</h4>

            <h2>What I Do</h2>
            <input type="text" value={this.state.what_i_do} onChange={this.handleChange("what_i_do")} placeholder="What I Do"/>
            <h4>Let people know what you do at App Academy.</h4>

            <h2>Phone Number</h2>
            <input type="text" value={this.state.phone_number} onChange={this.handleChange("phone_number")} placeholder="(123)-555-5555"/>
            <h4>Enter a phone number.</h4>

            <h2>Timezone</h2>
            <select name="timezone_offset" value={this.state.timezone_offset} onChange={this.handleChange("timezone_offset")}>
              { timeZones.map(([offset, description], idx) => {
                return (
                  <option value={parseInt(offset)} key={idx}>{description}</option>
                )
              })}
            </select>
            <h4>Your current timezone. Used for notifications, for times in your activity feeds, and for reminders.</h4>
          </div>
          <div className="photo">
            <h2>Profile Photo</h2>
            <div className="img-container">
              <img src={this.photoUrl()} alt=""/>
              <div className={this.state.loadingFile ? "loading" : "loading hidden"}>Loading...</div>
            </div>
            <input 
              type="file" 
              id="profile-photo-file"
              style={{display: "none"}}
              onChange={this.readFile}/>
            <input type="button" disabled={this.state.loadingFile} value="Upload File" onClick={() => document.getElementById('profile-photo-file').click()} />
            <input type="button" disabled={this.state.loadingFile} value="Clear Photo" onClick={() => this.setState({ deleteImage: true })} />
          </div>
        </div>
        <div className="form-buttons">
          <button onClick={this.handleCancel}>Cancel</button>
          { this.submitButton() }
        </div>
        <div className="form-errors">
          { Object.values(this.state.errors).map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="edit-profile-modal hidden">
        <div className="part-modal-background" onClick={this.handleCancel}></div>
        { this.modalForm() }
      </div>
    );
  }
}

export default EditProfileModal;