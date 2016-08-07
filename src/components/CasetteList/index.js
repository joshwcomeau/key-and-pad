import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { selectCasette } from '../../ducks/vcr-player.duck';
import Casette from '../Casette';
import './index.scss';


const CasetteList = ({ casettes, selectCasette }) => {
  const casetteIds = Object.keys(casettes);

  return (
    <div className="casette-list">
      {casetteIds.map(id => (
        <Casette
          key={id}
          sessionName={id}
          handleClick={selectCasette}
          {...casettes[id]}
        />
      ))}
    </div>
  )
}

CasetteList.propTypes = {
};

CasetteList.defaultProps = {
};

const mapStateToProps = state => ({
  casettes: state.vcrPlayer.casettes,
});

export default connect(mapStateToProps, {
  selectCasette,
})(CasetteList);
