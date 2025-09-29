import React from 'react';
import { Link } from 'react-router-dom';
import { postWorkspace, getWorkspace } from '../../actions/workspace_actions';
import { focus } from '../../util/modal_api_util';
import { findWorkspace } from '../../actions/workspace_actions';

import { withNavigate } from '../../withRouter';

class WorkspaceForm extends React.Component {
  constructor() {
    super();

    this.state = {
      page: "address",
      address: "",
      channel: "", 
      errors: {
        address: "",
      },
      disabled: true
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateField = this.updateField.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidUpdate() {
    focus("workspace-form-input");
  }

  nextButton(type) {
    if (this.state.disabled)
      return (<button onClick={() => this.handleSubmit(type)} disabled>Next</button>);
    else
      return (<button onClick={() => this.handleSubmit(type)}>Next</button>);
  }

  // Listens for enter key to submit
  handleKeyPress(type) {
    return (e) => {
      if (e.key === 'Enter' && !this.state.disabled) {
        this.handleSubmit(type);
      }
    };
  }

  handleSubmit(type) {
    switch(type) {
      case "address":
        dispatch(findWorkspace(this.state.address))
          .then(
            () => this.setState({ errors: {address: "Workspace address already taken."}, disabled: true }),
            () => this.setState({ page: "channel", disabled: true })
          )
        break;
      case "channel":
        this.setState({ page: "finish" })
        break;
      case "finish": //TODO1: FLASH ERRORS UPON RE-RENDER
        dispatch(postWorkspace(this.state))
          .then(
            ({workspace}) => this.props.navigate(`/workspace/${workspace.address}`),
            (errors) => {
              this.setState({page: "address", address: "", channel: ""})
            }
          )
    }
  }

  updateField(type) {
    return (e) => {
      let { value } = e.currentTarget;

      if (value === '')
        this.setState({ [type]: value, disabled: true })
      else {
        if (value.length == 1 && (value[0] == " " || value[0] == "-")) 
          return;
        let currentVal = value.split('');
        let lastVal = currentVal.pop();
        lastVal === ' ' ? currentVal.push('-') : currentVal.push(lastVal); 
        this.setState({ [type]: currentVal.join(''), disabled: false, errors:{[type]: ""} })
      }
    }
  }

  renderErrors(type) {
    return (
      <div className="workspace-form-error">
        {this.state.errors[type]}
      </div>
    )
  }

  render() {
    switch(this.state.page) {
      case "address":
        return (
          <div className="workspace-create" onKeyPress={this.handleKeyPress("address")}>
            <div className="workspace-create-nav">
              <Link className="logo" to="/">
                <img src="/images/logo.jpg" />
              </Link>
            </div>
            <div className="workspace-create-form">
              <h1>What's your workspace address?</h1>
              <input type="text" id="workspace-form-input" autoFocus
                    onChange={this.updateField("address")}
                    placeholder="Ex. aa or app-academy"
                    value={this.state.address}/>
              
              {this.nextButton("address")}
              {this.renderErrors("address")}
            </div>
          </div>
        )
      case "channel":
        return (
          <div className="workspace-create" onKeyPress={this.handleKeyPress("channel")}>
            <div className="workspace-create-nav">
              <Link className="logo" to="/">
                <img src="/images/logo.jpg" />
              </Link>
            </div>
            <div className="workspace-create-form">
              <h1>What's a project your team is working on?</h1>
              <input type="text" id="workspace-form-input"
                onChange={this.updateField("channel")}
                placeholder="Ex. Q1 Budget, User Authentication"
                value={this.state.channel}/>
              {this.nextButton("channel")}
            </div>
          </div>
        )
      case "finish":
        return (
          <div className="workspace-create" onKeyPress={this.handleKeyPress("finish")}>
            <div className="workspace-create-nav">
              <Link className="logo" to="/">
                <img src="/images/logo.jpg" />
              </Link>
            </div>
            <div className="workspace-create-form">
              <h1>Tada! Meet your team's first channel: #{this.state.channel}</h1>
              <h6>
                A channel brings together every part of your project - the people,
                conversations, ideas, updates, and files - so your team can move
                forward and get more done.
              </h6>
              <button onClick={() => this.handleSubmit("finish")} id="workspace-form-input">See Your Channel in Slock</button>
            </div>
          </div>
        )
    }
  }
}

export default withNavigate(WorkspaceForm);