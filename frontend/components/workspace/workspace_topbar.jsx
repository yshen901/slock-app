import React from "react";
import { withRouter } from "react-router";
import { hideElements, toggleElements } from "../../util/modal_api_util";

const DEFAULT_PHOTO_URL = '/images/profile/default.jpg';

class WorkspaceTopbar extends React.Component {
  constructor(props) {
    super(props);
  }

  photoUrl() {
    if (this.props.photo_url) 
      return this.props.photo_url;
    else 
      return DEFAULT_PHOTO_URL;
  }

  // hide all other dropdowns, then activate this one
  toggleElements(className, inputId) {
    return (e) => {
      e.stopPropagation();

      hideElements("dropdown"); 
      toggleElements(className);
    }
  }

  render() {
    return (
      <div id="workspace-top-bar">
        <div id="user-photo">
          <img src={this.photoUrl()} onClick={this.toggleElements("dropdown profile")}/>
        </div>
      </div>
    )
  }
}

export default withRouter(WorkspaceTopbar);