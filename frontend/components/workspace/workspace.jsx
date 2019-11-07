import React from 'react';

class Workspace extends React.Component {
  constructor() {
    super();

    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.logout()
      .then(
        () => this.props.history.push('/')
      )
  }

  render() {
    return (
      <div className="workspace">
        <div>
          Welcome to {this.props.workspace.address}
        </div>
        <button onClick={this.logout}>Log Out</button>
      </div>
    )
  }
}

export default Workspace;