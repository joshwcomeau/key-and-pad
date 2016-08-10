/* eslint-disable jsx-a11y/no-marquee */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as actionCreators from '../../ducks/vcr-player.duck';
import Icon from '../Icon';

import './index.scss';


// TODO: Move each of these components into their own file

// /////////////////////////// VCR BUTTON
const VCRButton = ({
  children, className, iconValue, iconSize, glowing, rounded, onClick,
}) => {
  const classes = classNames('vcr-button', className, {
    'vcr-button-glowing': glowing,
    'vcr-button-rounded': rounded,
  });

  // TODO: Switch from hardcoding the color to setting it in CSS with !important.
  // The icon's color needs to be set dynamically, via JS.

  return (
    <button className={classes} onClick={onClick}>
      {children || <Icon value={iconValue} size={iconSize} color="#f4f7f8" />}
    </button>
  );
};

VCRButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  iconValue: PropTypes.string.isRequired,
  iconSize: PropTypes.number,
  glowing: PropTypes.bool,
  rounded: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

VCRButton.defaultProps = {
  iconSize: 12,
  handleClick() {},
};


// //////////////////// POWER LIGHT
const VCRPowerLight = ({ mode }) => {
  const classes = classNames('vcr-power-light', {
    'light-off': mode === 'stopped',
    'light-amber': mode === 'paused',
    'light-green': mode === 'playing',
  });

  return (
    <div className={classes}>
      <div className="lightbulb" />
    </div>
  );
};

VCRPowerLight.propTypes = {
  mode: PropTypes.oneOf([
    'stopped',
    'playing',
    'paused',
  ]),
};


class VCR extends Component {
  renderScreen() {
    const { playStatus, casetteStatus } = this.props;

    if (casetteStatus === 'idle') {
      return (
        <div className="vcr-screen-contents">
          <div className="vcr-screen-idle">
            {/*
              Well, since this is a retro-themed devtool,
              why not go oldschool? >:D
              TODO: Replace this with a Marquee component
            */}
            <marquee>Click to Select a Casette</marquee>
          </div>
        </div>
      );
    } else if (casetteStatus === 'selecting') {
      return (
        <div className="vcr-screen-contents">
          <div className="vcr-screen-selecting">Selecting...</div>
        </div>
      );
    }

    let labelText;
    switch (playStatus) {
      case 'playing': labelText = 'Now Playing'; break;
      case 'paused': labelText = 'Paused'; break;
      default: labelText = 'Selected'; break;
    }

    return (
      <div className="vcr-screen-contents">
        <div className="vcr-screen-label">{labelText}</div>
        <div className="vcr-screen-session-name">
          {this.props.selectedCasette}
        </div>
      </div>
    );
  }

  render() {
    const {
      doorLabel,
      playStatus,
      casetteStatus,
      playCasette,
      pauseCasette,
      stopCasette,
      viewCasettes,
      ejectCasette,
    } = this.props;

    const doorOpen = casetteStatus === 'selecting';

    console.log("PLAY STATUS", playStatus)

    let playPauseAction;
    if (casetteStatus !== 'loaded') {
      playPauseAction = () => {};
    } else if (playStatus === 'playing') {
      playPauseAction = pauseCasette;
    } else {
      playPauseAction = playCasette;
    }

    return (
      <div className="vcr">

        <div className="vcr-top" />
        <div className="vcr-bg" />
        <VCRButton
          className="eject-button"
          onClick={ejectCasette}
          iconValue="eject"
          iconSize={16}
        />
        <div
          className={`casette-slot-door ${doorOpen ? 'is-open' : ''}`}
        >
          <span className="casette-slot-door-label">
            {doorLabel}
          </span>
        </div>
        <div className="casette-slot" onClick={viewCasettes} />

        <div className="vcr-screen" onClick={viewCasettes}>
          {this.renderScreen()}
        </div>

        <div className="primary-action-buttons">
          <VCRButton
            className="play-pause-button"
            onClick={playPauseAction}
            iconValue={playStatus === 'playing' ? 'pause' : 'play'}
            iconSize={20}
            glowing={casetteStatus === 'loaded' && playStatus === 'stopped'}
          />
          <VCRButton
            className="stop-button"
            onClick={stopCasette}
            iconValue={'stop'}
            iconSize={20}
            glowing={playStatus === 'playing' || playStatus === 'paused'}
          />
        </div>

        <div className="secondary-action-buttons">
          <VCRButton
            className="speed-half"
            onClick={playPauseAction}
          >
            .5x
          </VCRButton>
          <VCRButton
            className="speed-normal"
            onClick={playPauseAction}
          >
            1x
          </VCRButton>
          <VCRButton
            className="speed-double"
            onClick={playPauseAction}
          >
            2x
          </VCRButton>
        </div>

        <div className="decorative-outputs">
          <div className="decorative-output yellow" />
          <div className="decorative-output white" />
          <div className="decorative-output red" />
        </div>

        <VCRPowerLight mode={playStatus} />

        <div className="vcr-foot vcr-foot-left" />
        <div className="vcr-foot vcr-foot-right" />
      </div>
    );
  }
}

VCR.propTypes = {
  doorLabel: PropTypes.string,
  playStatus: PropTypes.string,
  casetteStatus: PropTypes.string,
  selectedCasette: PropTypes.string,
  playCasette: PropTypes.func.isRequired,
  pauseCasette: PropTypes.func.isRequired,
  stopCasette: PropTypes.func.isRequired,
  viewCasettes: PropTypes.func.isRequired,
  ejectCasette: PropTypes.func.isRequired,
};

VCR.defaultProps = {
  doorLabel: 'HI-FI STEREO SYSTEM',
};

const mapStateToProps = state => ({
  playStatus: state.vcrPlayer.playStatus,
  casetteStatus: state.vcrPlayer.casetteStatus,
  selectedCasette: state.vcrPlayer.selectedCasette,
});


export default connect(mapStateToProps, {
  playCasette: actionCreators.playCasette,
  pauseCasette: actionCreators.pauseCasette,
  stopCasette: actionCreators.stopCasette,
  ejectCasette: actionCreators.ejectCasette,
  viewCasettes: actionCreators.viewCasettes,
})(VCR);
