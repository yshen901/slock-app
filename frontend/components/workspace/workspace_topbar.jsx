import React from "react";
import { getUserActivity, getUserPaused } from "../../selectors/selectors";
import { toggleFocusElements } from "../../util/modal_api_util";

class WorkspaceTopbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { user } = this.props;

    return (
      <div id="workspace-top-bar">
        <div className="user-icon">
          <div id="user-photo">
            <img src={user.photo_url} onClick={toggleFocusElements("dropdown-modal profile")}/>
          </div>
          <div className={getUserPaused(user)}>z</div>
          <i className={getUserActivity(user)}></i>
        </div>
      </div>
    )
  }
}

export default WorkspaceTopbar;