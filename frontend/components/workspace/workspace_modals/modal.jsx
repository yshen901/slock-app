import React from 'react';

class Modal extends React.Component {
  constructor() {
    super();
  }
  
  componentDidMount() {
  }

  render() {
    return (
      <div className={this.props.modalClass}>
        <div className="modal-button" onClick={() => this.props.close()}>&#10005;</div>
        <div className="modal-header">Browse Channels</div>
        <div className="modal-list">
          {this.props.modalInfo.map((item, idx) => {
            return <div className="modal-item" key={idx}>{item.name}</div>
          })}
        </div>
      </div>
    )
  }
}

export default Modal;