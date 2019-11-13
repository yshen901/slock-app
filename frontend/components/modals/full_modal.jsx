import React from 'react';
import { hideElements } from '../../util/modal_api_util';

class FullModal extends React.Component {
  constructor() {
    super();
  }
  
  render() {
    return (
      <div className={this.props.modalClass} onClick={e => e.stopPropagation()}>
        <div className="full-modal-button" onClick={ () => hideElements("full-modal channel-modal") }>&#10005;</div>
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