/* eslint-disable jsx-a11y/no-marquee */
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';

import './index.scss';


// TODO: This should probably be broken into a few components (VCRButton,
// RCAOutput, etc). Because I want to limit extraction costs from this repo,
// this should come once ReduxVCR is its own thing.
const VCRButton = ({
  className, iconValue, iconSize, glowing, rounded, onClick,
}) => {
  const classes = classNames('vcr-button', className, {
    'vcr-button-glowing': glowing,
    'vcr-button-rounded': rounded,
  });

  // TODO: Switch from hardcoding the color to setting it in CSS with !important.
  // The icon's color needs to be set dynamically, via JS.

  return (
    <button className={classes} onClick={onClick}>
      <Icon value={iconValue} size={iconSize} color="#f4f7f8" />
    </button>
  );
};

VCRButton.propTypes = {
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
      handleClickPlay,
      handleClickPause,
      handleClickSlot,
      handleClickScreen,
      handleClickEject,
    } = this.props;

    const doorOpen = casetteStatus === 'selecting';

    let playPauseAction;
    if (casetteStatus !== 'loaded') {
      playPauseAction = () => {};
    } else if (playStatus === 'playing') {
      playPauseAction = handleClickPause;
    } else {
      playPauseAction = handleClickPlay;
    }

    return (
      <div className="vcr">

        <div className="vcr-top" />
        <div className="vcr-bg" />
        <VCRButton
          className="eject-button"
          onClick={handleClickEject}
          iconValue="eject"
        />
        <div
          className={`casette-slot-door ${doorOpen ? 'is-open' : ''}`}
        >
          <span className="casette-slot-door-label">
            {doorLabel}
          </span>
        </div>
        <div className="casette-slot" onClick={handleClickSlot} />

        <div className="vcr-screen" onClick={handleClickScreen}>
          {this.renderScreen()}
        </div>

        <div className="primary-action-buttons">
          <VCRButton
            className="fast-rewind-button"
            onClick={() => {}}
            iconValue="fast_rewind"
          />

          <VCRButton
            className="play-button"
            onClick={playPauseAction}
            iconValue={playStatus === 'playing' ? 'pause' : 'play'}
            iconSize={24}
            glowing={casetteStatus === 'loaded' && playStatus === 'stopped'}
            rounded
          />

          <VCRButton
            className="fast-forward-button"
            onClick={() => {}}
            iconValue="fast_forward"
          />
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
  mode: PropTypes.oneOf(['stopped', 'playing', 'paused']),
  doorLabel: PropTypes.string,
  playStatus: PropTypes.string,
  casetteStatus: PropTypes.string,
  selectedCasette: PropTypes.string,
  handleClickPlay: PropTypes.func.isRequired,
  handleClickPause: PropTypes.func.isRequired,
  handleClickSlot: PropTypes.func,
  handleClickScreen: PropTypes.func,
  handleClickEject: PropTypes.func.isRequired,
};

VCR.defaultProps = {
  doorLabel: 'HI-FI STEREO SYSTEM',
};

export default VCR;
