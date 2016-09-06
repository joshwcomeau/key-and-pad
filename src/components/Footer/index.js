import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { openModal } from '../../actions';
import Icon from '../Icon';
import './index.scss';

const Footer = ({ openModal }) => (
  <footer className="footer">
    <div className="attribution">
      Made with
      <Icon value="music_note" size={20} />
      by&nbsp;
      <a href="https://twitter.com/JoshWComeau">Joshua Comeau</a>
    </div>
    <div className="privacy-notification">
      The sounds you make are being persisted and published, for others to enjoy.&nbsp;
      <a
        href="/privacy-policy"
        className="dark-gray"
        onClick={e => {
          e.preventDefault();
          openModal({ name: 'privacy-policy' });
        }}
      >
        Read more
      </a>
      .
    </div>
  </footer>
);

Footer.propTypes = {
  openModal: PropTypes.func.isRequired,
};


export default connect(null, { openModal })(Footer);
