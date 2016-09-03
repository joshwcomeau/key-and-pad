/* eslint-disable max-len, no-shadow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';

import Modal from '../Modal';
import { closeModal } from '../../actions';
import './index.scss';

const sampleData = `
  [
    {
      type: 'UPDATE_EFFECTS_AMOUNT',
      x: { amount: 0.1 },
      y: { amount: 0.45},
      delay: 400
    }, {
      type: 'ADD_NOTE',
      value: 'G4',
      delay: 100
    }, {
      type: 'REMOVE_NOTE',
      value: 'G4',
      delay: 1000
    }
  ]
`;

const PrivacyPolicy = ({ isOpen, closeModal }) => (
  <Modal
    className="privacy-policy"
    isOpen={isOpen}
    onRequestClose={closeModal}
  >
    <h2 className="modal-title">Data Collection</h2>
    <p>When building this web app, I thought it would be really neat if I could hear the stuff that users create.</p>
    <p>Rather than try to record audio or mouse/keyboard events, I'm persisting the "actions" themselves; the instructions passed through the application to trigger the sounds.</p>
    <p>Here's a sample of the data being collected:</p>
    <SyntaxHighlighter language="javascript" style={docco}>
      {sampleData}
    </SyntaxHighlighter>
    <p>By simply rerunning the stream of actions on my local machine, I'm able to recreate the sounds.</p>
    <p><strong>Note:</strong> It is important to clarify that <em>absolutely no personally-identifying information</em> is sent along with this data. A random ID is generated to differentiate between sessions, but no additional data is persisted.</p>
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
