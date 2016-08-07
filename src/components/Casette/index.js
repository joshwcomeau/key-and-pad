import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const Casette = ({ sessionName, timestamp, numOfActions, handleClick }) => {
  console.log("PROP", handleClick)
  return (
    <div className="casette" onClick={() => handleClick({ id: sessionName })}>
      <div className="front">
        <div className="head" />
        <div className="spool left-spool">
          <div className="tape" />
        </div>
        <div className="spool right-spool">
          <div className="tape" />
        </div>
      </div>

      <div className="spine">
        <div className="mould-marks">
          <div className="seam" />
          <div className="square" />
        </div>
        <div className="label">
          <div className="line">
            <span className="line-name">Name:</span>
            {sessionName}
          </div>
          <div className="line">
            <span className="line-name">Recorded:</span>
            {timestamp}
            <span className="line-name indented">Actions:</span>
            {numOfActions}
          </div>
        </div>
        <div className="vhs-footer">VHS</div>
      </div>
    </div>
  )
}

Casette.propTypes = {
  sessionName: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  numOfActions: PropTypes.number.isRequired,
  handleClick: PropTypes.func,
  // theme: PropTypes.oneOf(['rainbow', ''])
};

Casette.defaultProps = {
  // TODO: Make this randomly select from the list.
  theme: 'rainbow',
  handleClick() {},
};

export default Casette;
