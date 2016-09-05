import React from 'react';

import Logo from '../Logo';
import './index.scss';

const Header = () => (
  <header className="header">
    <Logo />
    <a
      className="octocat no-underline"
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/joshwcomeau/Key-Pad"
    >
      <img
        src="src/images/daftpunktocat_bangalter_150.gif"
        alt="View on GitHub"
      />
    </a>
  </header>
);

export default Header;
