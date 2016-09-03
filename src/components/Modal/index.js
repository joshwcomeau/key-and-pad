import React, { PropTypes } from 'react';
import classNames from 'classnames';

import Icon from '../Icon';

import './index.scss';

const Modal = ({ children, className = '', isOpen, onRequestClose } = {}) => (
  <div className={classNames('modal-container', isOpen ? 'open' : 'close')}>
    <div className="modal-overlay" />
    <div className={classNames('modal', className)}>
      <div className="modal-background" />
      <div className="modal-contents">
        <button className="modal-close" onClick={onRequestClose}>
          <Icon value="close" />
          {children}
        </button>
      </div>
    </div>
  </div>
);

Modal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
};

export default Modal;
