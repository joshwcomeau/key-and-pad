import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  casettesListRequest,
  viewCasettes,
  selectCasette,
  togglePlay,
} from '../../ducks/vcr-player.duck';
import VCR from '../VCR';
import CasetteList from '../CasetteList';
import Backdrop from '../Backdrop';

import './index.scss';


class ReduxVCR extends Component {
  componentDidMount() {
    this.props.casettesListRequest();

    // setTimeout(() => {
    //   this.props.selectCasette({ id: '3fef7270-804a-4718-abdf-156904ee8661' })
    // }, 2000)
  }

  render() {
    const {
      position,
      isPlaying,
      isSelectingCasette,
      casettes,
      selectedCasette,
      togglePlay,
      viewCasettes,
    } = this.props;

    const classes = classNames('redux-vcr-component', position);

    return (
      <div className={classes}>
        <VCR
          isPlaying={isPlaying}
          isSelectingCasette={isSelectingCasette}
          selectedCasette={selectedCasette}
          handleClickPlay={togglePlay}
          handleClickSlot={viewCasettes}
          handleClickScreen={viewCasettes}
        />
        { isSelectingCasette ? <CasetteList /> : null }
        <Backdrop
          isShown={isSelectingCasette}
          opacity={0.9}
          color="#FFF"
        />
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
  isPlaying: state.vcrPlayer.isPlaying,
  isSelectingCasette: state.vcrPlayer.isSelectingCasette,
  casettes: state.vcrPlayer.casettes,
  selectedCasette: state.vcrPlayer.selectedCasette,
})


export default connect(
  mapStateToProps,
  {
    casettesListRequest,
    viewCasettes,
    selectCasette,
    togglePlay,
  }
)(ReduxVCR);
