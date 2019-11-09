import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { postWorkspace, getWorkspace } from '../../actions/workspace_actions';

class WorkspaceForm extends React.Component {
  constructor() {
    super();

    this.state = {
      page: "address",
      address: "",
      channel: "", 
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  handleSubmit(type) {
    switch(type) {
      case "address":
        this.setState({page: "channel"})
        break;
      case "channel":
        this.setState({ page: "finish" })
        break;
      case "finish": //TODO1: FLASH ERRORS UPON RE-RENDER
        dispatch(postWorkspace(this.state))
          .then(
            () => this.props.history.push(`/workspace/${this.state.address}`),
            () => this.setState({page: "address", address: "", channel: ""})
          )
    }
  }

  updateField(type) {
    return (e) => this.setState({ [type]: e.currentTarget.value })
  }

  // TODO2: ADD A WHO ELSE IS WORKING ON THIS PROJECT FORM
  // NOTE: IF YOU USE AN INPUT WITHOUT A FORM, YOU WILL NEED TO SET A VALUE
  //       OR IT WON'T REGISTER (I THINK) ... MORE RESEARCH NEEDED IF YOU HAVE TIME
  render() {
    switch(this.state.page) {
      case "address":
        return (
          <div className="workspace-create">
            <div className="workspace-create-nav">
              <Link className="logo" to="/">
                <img src="/images/logo.png" />
              </Link>
            </div>
            <div className="workspace-create-form">
              <h1>What's the name of your company or team?</h1>
              <input type="text" 
                    onChange={this.updateField("address")}
                    placeholder="Ex. aA or App Academy"
                    value={this.state.address}/>
              <button onClick={() => this.handleSubmit("address")}>Next</button>
            </div>
          </div>
        )
      case "channel":
        return (
          <div className="workspace-create">
            <div className="workspace-create-nav">
              <Link className="logo" to="/">
                <img src="/images/logo.png" />
              </Link>
            </div>
            <div className="workspace-create-form">
              <h1>What's a project your team is working on?</h1>
              <input type="text"
                onChange={this.updateField("channel")}
                placeholder="Ex. Q1 Budget, User Authentication"
                value={this.state.channel}/>
              <button onClick={() => this.handleSubmit("channel")}>Next</button>
            </div>
          </div>
        )
      case "finish":
        return (
          <div className="workspace-create">
            <div className="workspace-create-nav">
              <Link className="logo" to="/">
                <img src="/images/logo.png" />
              </Link>
            </div>
            <div className="workspace-create-form">
              <h1>Tada! Meet your team's first channel: #{this.state.channel}</h1>
              <h6>
                A channel brings together every part of your project - the people,
                conversations, ideas, updates, and files - so your team can move
                forward and get more done.
              </h6>
              <button onClick={() => this.handleSubmit("finish")}>See Your Channel in Slack</button>
            </div>
          </div>
        )
    }
  }
}

export default withRouter(WorkspaceForm);