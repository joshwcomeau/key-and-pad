import React, { PropTypes } from 'react';

import './index.scss';


const VCR = ({ position }) => {
  return (
    <div className={`redux-vcr-component ${position}`}>
      <div className="casette-slot">
        Load Casette
      </div>

      <div className="vcr-screen">
        231e7e68-8b63-443d-958b-60d6c4b95cea
      </div>

      <div className="decorative-outputs">
        <div className="decorative-output yellow" />
        <div className="decorative-output white" />
        <div className="decorative-output red" />
      </div>

      <div className="vcr-foot vcr-foot-left" />
      <div className="vcr-foot vcr-foot-right" />
    </div>
  )
};

VCR.propTypes = {
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ]),
};

VCR.defaultProps = {
  position: 'bottom-left',
};

export default VCR;
