import React from "react";
import { withRouter } from "react-router";
import { getUserActivity, photoUrl } from "../../selectors/selectors";
import { toggleFocusElements } from "../../util/modal_api_util";

class WorkspaceTopbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="workspace-top-bar">
        <div id="user-photo">
          <img src={photoUrl(this.props.user)} onClick={toggleFocusElements("dropdown-modal profile")}/>
          <i className={getUserActivity(this.props.user)}></i>
        </div>
      </div>
    )
  }
}

export default withRouter(WorkspaceTopbar);