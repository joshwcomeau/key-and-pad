import React, { PropTypes } from 'react';
import classNames from 'classnames';

import Casette from '../Casette';
import './index.scss';


const CasetteList = ({ casettes = {} } = {}) => {
  console.log("Casette List given", casettes)
  const casetteIds = Object.keys(casettes);

  return (
    <div className="casette-list">
      {casetteIds.map(id => (
        <Casette key={id} sessionName={id} {...casettes[id]} />
      ))}
    </div>
  )
}

CasetteList.propTypes = {
};

CasetteList.defaultProps = {
};

export default CasetteList;
