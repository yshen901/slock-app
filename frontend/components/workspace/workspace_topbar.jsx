import React from "react";
import { withRouter } from "react-router";
import { photoUrl } from "../../selectors/selectors";
import { hideElements, toggleElements } from "../../util/modal_api_util";

class WorkspaceTopbar extends React.Component {
  constructor(props) {
    super(props);
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
          <img src={photoUrl(this.props.user)} onClick={this.toggleElements("dropdown profile")}/>
        </div>
      </div>
    )
  }
}

export default withRouter(WorkspaceTopbar);