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

    // setTimeout(() => {
    //   this.props.selectCasette({ id: '3fef7270-804a-4718-abdf-156904ee8661' })
    // }, 2000)
  }

  render() {
    const {
      isPlaying,
      isSelectingCasette,
      selectedCasette,
      togglePlay,
      viewCasettes,
      hideCasettes,
    } = this.props;

    return (
      <div className="redux-vcr-component">
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
          handleClickClose={hideCasettes}
          opacity={0.9}
          background="#FFF"
        />
      </div>
    );
  }
}

ReduxVCR.propTypes = {
  isPlaying: PropTypes.bool,
  isSelectingCasette: PropTypes.bool,
  casettes: PropTypes.object,
  selectedCasette: PropTypes.string,
  casettesListRequest: PropTypes.func,
  viewCasettes: PropTypes.func,
  hideCasettes: PropTypes.func,
  selectCasette: PropTypes.func,
  togglePlay: PropTypes.func,
};

ReduxVCR.defaultProps = {
  position: 'bottom-left',
};

const mapStateToProps = state => ({
  isPlaying: state.vcrPlayer.isPlaying,
  isSelectingCasette: state.vcrPlayer.isSelectingCasette,
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
    togglePlay: actionCreators.togglePlay,
  }
)(ReduxVCR);
