import React from 'react';

class FullModal extends React.Component {
  constructor() {
    super();
  }
  
  componentDidMount() {
  }

  render() {
    return (
      <div className={this.props.modalClass}>
        <div className="full-modal-button" onClick={this.props.close}>&#10005;</div>
        <div className="full-modal-header">Browse Channels</div>
        <div className="full-modal-list">
          {this.props.modalInfo.map((item, idx) => {
            return <div className="full-modal-item" key={idx}>{item.name}</div>
          })}
        </div>
      </div>
    )
  }
}

export default FullModal;