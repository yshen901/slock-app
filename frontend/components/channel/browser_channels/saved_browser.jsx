import React from "react";
import { withRouter } from "react-router";
import { startDmChannel } from "../../../actions/dm_channel_actions";
import { getMessageSaves } from "../../../actions/message_actions";
import { getUserActivity, getUserName, getUserPaused, photoUrl, sortedUsers, userInSearch } from "../../../selectors/selectors";
import { toggleFocusElements } from "../../../util/modal_api_util";

class SavedBrowser extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    dispatch(getMessageSaves(getState().session.workspace_id))
  }

  render() {
    return (
      <div className="browser-channel" onClick={e => e.stopPropagation()}>
      </div>
    )
  }
}

export default withRouter(SavedBrowser);