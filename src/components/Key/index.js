import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const Key = ({ letter, keyStyle, active, ...data}) => {
  const classes = classNames('key', keyStyle, { active });

  return (
    <div className={classes}>
      {letter}
    </div>
  );
};

Key.propTypes = {
  letter: PropTypes.string.isRequired,
  keyStyle: PropTypes.oneOf([
    'black',
    'white',
    'placeholder',
  ]),
  active: PropTypes.bool,
};

export default Key;
