import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as actionCreators from '../../ducks/vcr-player.duck';
import VCR from '../VCR';
import CasetteList from '../CasetteList';
import Backdrop from '../Backdrop';

import './index.scss';


class ReduxVCR extends Component {
  componentDidMount() {
    this.props.casettesListRequest();
  }

  render() {
    const {
      playStatus,
      casetteStatus,
      selectedCasette,
      togglePlayPause,
      viewCasettes,
      hideCasettes,
      ejectCasette,
    } = this.props;

    return (
      <div className="redux-vcr-component">
        <VCR
          playStatus={playStatus}
          casetteStatus={casetteStatus}
          selectedCasette={selectedCasette}
          handleClickPlay={togglePlayPause}
          handleClickSlot={viewCasettes}
          handleClickScreen={viewCasettes}
          handleClickEject={ejectCasette}
        />
        { casetteStatus === 'selecting' ? <CasetteList /> : null }
        <Backdrop
          isShown={casetteStatus === 'selecting'}
          handleClickClose={hideCasettes}
          opacity={0.9}
          background="#FFF"
        />
      </div>
    );
  }
}

ReduxVCR.propTypes = {
  playStatus: PropTypes.string,
  casetteStatus: PropTypes.string,
  casettes: PropTypes.object,
  selectedCasette: PropTypes.string,
  casettesListRequest: PropTypes.func,
  viewCasettes: PropTypes.func,
  hideCasettes: PropTypes.func,
  selectCasette: PropTypes.func,
  ejectCasette: PropTypes.func,
  togglePlayPause: PropTypes.func,
};

ReduxVCR.defaultProps = {
  position: 'bottom-left',
};

const mapStateToProps = state => ({
  playStatus: state.vcrPlayer.playStatus,
  casetteStatus: state.vcrPlayer.casetteStatus,
  casettes: state.vcrPlayer.casettes,
  selectedCasette: state.vcrPlayer.selectedCasette,
});


export default connect(
  mapStateToProps,
  {
    casettesListRequest: actionCreators.casettesListRequest,
    viewCasettes: actionCreators.viewCasettes,
    hideCasettes: actionCreators.hideCasettes,
    selectCasette: actionCreators.selectCasette,
    ejectCasette: actionCreators.ejectCasette,
    togglePlayPause: actionCreators.togglePlayPause,
  }
)(ReduxVCR);
