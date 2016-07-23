import React, { PropTypes } from 'react';
import './index.css';

const Key = ({ letter }) => {
  return (
    <div className="key">
      {letter}
    </div>
  );
}

Key.propTypes = {
  letter: PropTypes.string.isRequired,
};

export default Key;
