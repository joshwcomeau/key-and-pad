import React, { PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

import VCR from '../VCR';

const ReduxVCR = ({ position }) => {
  const classes = classNames('redux-vcr-component', position);

  return (
    <div className={classes}>
      <VCR />
      <CasetteList
    </div>
  )
}

ReduxVCR.propTypes = {
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ]),
};

ReduxVCR.defaultProps = {
  position: 'bottom-left',
};

export default ReduxVCR;
