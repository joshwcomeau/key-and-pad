import React from 'react';

import Logo from '../Logo';
import daftPunkImage from '../../images/daftpunktocat_bangalter_150.gif';
import './index.scss';

const Header = () => (
  <header className="header">
    <Logo />
    <a
      className="octocat no-underline"
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/joshwcomeau/key-and-pad"
    >
      <img
        src={daftPunkImage}
        alt="View on GitHub"
      />
    </a>
  </header>
);

export default Header;
