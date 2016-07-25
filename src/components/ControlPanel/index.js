import React from 'react';

import Subheading from '../Subheading';
import './index.scss';

const ControlPanel = () => (
  <div className="control-panel">
    <div className="panel keys">
      <Subheading>
        Keys
      </Subheading>
    </div>

    <div className="panel pad">
      <Subheading>
        Pad
      </Subheading>
    </div>
  </div>
);

export default ControlPanel;
