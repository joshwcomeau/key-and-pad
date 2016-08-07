import React, { Component, PropTypes } from 'react';
import Icon from '../Icon';

import './index.scss';


// TODO: This should probably be broken into a few components (VCRButton,
// RCAOutput, etc). Because I want to limit extraction costs from this repo,
// this should come once ReduxVCR is its own thing.
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
      casetteStatus,
      handleClickPlay,
      handleClickSlot,
      handleClickScreen,
      handleClickEject,
    } = this.props;

    const doorOpen = casetteStatus === 'selecting';

    return (
      <div className="vcr">

        <div className="vcr-top" />
        <div className="vcr-top-edge" />
        <div className="vcr-bg" />
        <div className="vcr-button eject-button" onClick={handleClickEject}>
          <Icon value="eject" color="#f4f7f8" size={12} />
        </div>
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
          <div className="vcr-button fast-rewind-button">
            <Icon value="fast_rewind" color="#f4f7f8" size={12} />
          </div>

          <div
            className="vcr-button play-button"
            onClick={handleClickPlay}
          >
            <Icon value="play" color="#f4f7f8" size={24} />
          </div>

          <div className="vcr-button fast-forward-button">
            <Icon value="fast_forward" color="#f4f7f8" size={12} />
          </div>
        </div>

        <div className="decorative-outputs">
          <div className="decorative-output yellow" />
          <div className="decorative-output white" />
          <div className="decorative-output red" />
        </div>

        <div className="power-light" />

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
  handleClickPlay: PropTypes.func.isRequired,
  handleClickSlot: PropTypes.func,
  handleClickScreen: PropTypes.func,
  handleClickEject: PropTypes.func.isRequired,
};

VCR.defaultProps = {
  doorLabel: 'HI-FI STEREO SYSTEM',
};

export default VCR;
