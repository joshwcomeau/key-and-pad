import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  casettesListRequest,
  selectCasette,
  togglePlay,
} from '../../ducks/vcr-player.duck';
import VCR from '../VCR';
import CasetteList from '../CasetteList';

import './index.scss';


class ReduxVCR extends Component {
  componentDidMount() {
    this.props.casettesListRequest();

    setTimeout(() => {
      this.props.selectCasette({ id: '85724d2c-dd5a-4599-9ab3-9d65308872df' })
    }, 2000)
  }

  render() {
    const { position, casettes, togglePlay } = this.props;

    const classes = classNames('redux-vcr-component', position);

    return (
      <div className={classes}>
        <VCR handleClickPlay={togglePlay} />
        <CasetteList casettes={casettes} />
      </div>
    );
  }
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

const mapStateToProps = state => ({
  casettes: state.vcrPlayer.casettes,
})


export default connect(
  mapStateToProps,
  {
    casettesListRequest,
    selectCasette,
    togglePlay,
  }
)(ReduxVCR);
