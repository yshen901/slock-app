import React from 'react';
import { Link } from 'react-router-dom';
import { objectToArray } from '../../selectors/selectors';
import { getWorkspaces } from '../../actions/workspace_actions';

class SidebarDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let dropdownClass = `dropdown sidebar ${this.props.hidden}`;
    return (
      <div className={dropdownClass}>
      </div>
    )
  }
}

export default SidebarDropdown;