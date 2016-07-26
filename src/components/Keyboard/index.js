import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import keycode from 'keycode';
import { toFreq } from 'tonal-freq'

import Key from '../Key';
import { pressKey, releaseKey } from '../../ducks/keyboard.duck';
import keyboardNotes from '../../data/keyboard_notes';
import './index.scss';


export class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.handleRelease = this.handleRelease.bind(this);
    this.renderKey = this.renderKey.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handlePress);
    window.addEventListener('keyup', this.handleRelease);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlePress);
    window.removeEventListener('keyup', this.handleRelease);
  }

  handlePress(ev) {
    const letter = keycode(ev).toUpperCase();
    const note = keyboardNotes[letter]
    const frequency = toFreq(note);

    const isValidKeyPressed = !!frequency;
    const isAlreadyPlaying = !!this.props.keys[letter];
    const isSpecialKeyPressed = !!ev.metaKey || !!ev.ctrlKey || !!ev.shiftKey;

    if (isValidKeyPressed && !isAlreadyPlaying && !isSpecialKeyPressed) {
      this.props.pressKey({ letter, note, frequency })
    }
  }

  handleRelease(ev) {
    const letter = keycode(ev).toUpperCase();
    const note = keyboardNotes[letter]
    const frequency = toFreq(note);

    this.props.releaseKey({ letter, note, frequency });
  }

  renderKey(key) {
    return (
      <Key
        {...key}
        key={key.letter}
        active={!!this.props.keys[key.letter]}
      />
    )
  }

  renderRow(row, index) {
    return (
      <div className="keyboard-row" key={index}>
        {row.map(this.renderKey)}
      </div>
    );
  }

  render() {
    return (
      <div className="keyboard">
        {this.props.layout.map(this.renderRow)}
      </div>
    );
  }
}

Keyboard.PropTypes = {
  layout: PropTypes.arrayOf(PropTypes.array).isRequired,
  pressKey: PropTypes.func.isRequired,
  releaseKey: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  keys: state.keyboard.keys,
});

export default connect(mapStateToProps, { pressKey, releaseKey })(Keyboard);
