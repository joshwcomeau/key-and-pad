import React, { PropTypes } from 'react';
import Modal from '../Modal';
import './index.scss';

const PrivacyPolicy = () => (
  <Modal className="privacy-policy" isOpen onRequestClose={() => {}}>
    <h2>Privacy Policy</h2>
    <p>Lorem Ipsum yadda yadda</p>
  </Modal>
);

PrivacyPolicy.propTypes = {};

export default PrivacyPolicy;
