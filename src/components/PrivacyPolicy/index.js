import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Modal from '../Modal';
import { closeModal } from '../../actions';
import './index.scss';

const PrivacyPolicy = ({ isOpen, closeModal }) => (
  <Modal className="privacy-policy" isOpen={isOpen} onRequestClose={closeModal}>
    <h2>Privacy Policy</h2>
    <p>Lorem Ipsum yadda yadda</p>
  </Modal>
);

PrivacyPolicy.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isOpen: state.modal === 'privacy-policy',
});

export default connect(mapStateToProps, { closeModal })(PrivacyPolicy);
