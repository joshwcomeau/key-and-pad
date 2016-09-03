import React, { PropTypes } from 'react';

import Icon from '../Icon';
import './index.scss';

const Footer = () => (
  <footer className="footer">
    <div className="attribution">
      Made with
      <Icon value="music_note" size={20} />
      by&nbsp;
      <a href="https://twitter.com/JoshWComeau">Joshua Comeau</a>
    </div>
    <div className="privacy-notification">
      The sounds you make are being persisted, so that the author can enjoy them.&nbsp;
      <a href="/privacy-policy" className="dark-gray">Read more</a>.
    </div>
  </footer>
);

export default Footer;
