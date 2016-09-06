import React from 'react';

import Icon from '../Icon';
import Footer from '../Footer';
import './index.scss';


const MobileNotification = () => (
  <div className="mobile-notification">
    <Icon value="error" color="#F35638" size="96" />
    <h3>Sorry, this is a desktop-only experience.</h3>
    <p>
      This web synthesizer needs a mouse and keyboard to operate,
      and so it cannot run on mobile devices.
    </p>
    <p className="alternative">
      <a href="http://martinwecke.de/108/">Here's something neat</a> that will run on your phone :)
    </p>
  </div>
);

export default MobileNotification;
