/* eslint-disable max-len, no-shadow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Modal from '../Modal';
import Logo from '../Logo';
import HorizontalRule from '../HorizontalRule';
import { closeModal } from '../../actions';
import './index.scss';


const PrivacyPolicy = ({ isOpen, closeModal }) => (
  <Modal
    className="privacy-policy"
    isOpen={isOpen}
    onRequestClose={closeModal}
  >
    <h2 className="modal-title">Data Collection</h2>
    <p>
      While building <Logo size="small" />, I anticipated that people would make really great music with it. I didn't want to miss all the creative things users would do with my web app!
    </p>
    <p>
      I decided to build an accompanying tool that would capture user sessions, in an anonymized and secure way, so that I could hear what gets made.
    </p>
    <p>
      No audio is recorded. Instead, I record the sequence of actions. To replay the session, I can just run the sequence of actions through the application, and re-create it on-the-fly.
    </p>
    <p>
      <strong>
        This data is totally anonymous, and no device/IP info is collected.&nbsp;
        <a
          href="sample-cassette-actions.json"
          target="_blank"
          rel="noopener noreferrer"
        >
          View the data from a sample session
        </a>.
      </strong>
    </p>

    <HorizontalRule background="white" />

    <h4 className="listen-header">Listen to other sessions</h4>
    <p>
      Curious what others have created? <a href="/?adminMode=true">Follow this link</a>, and use the VCR at the bottom; hopefully it's fairly intuitive!
    </p>
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
