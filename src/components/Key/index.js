import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.css';


const Key = ({ letter, keyStyle, ...data}) => {
  console.log(letter, keyStyle, data);

  const classes = classNames('key', keyStyle);

  return (
    <div className={classes}>
      {letter}
    </div>
  );
}

Key.propTypes = {
  letter: PropTypes.string.isRequired,
};

export default Key;
