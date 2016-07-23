import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import keycode from 'keycode';

import Key from '../Key';
import { pressKey, releaseKey } from '../../ducks/keyboard.duck';
import keyboardFrequencies from '../../data/keyboard_frequencies';
import './index.css';


export class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.renderKey = this.renderKey.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handlePress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlePress);
  }

  handlePress(ev) {
    console.log(this.props);
    const letter = keycode(ev).toUpperCase();
    const frequency = keyboardFrequencies[letter];

    const isValidKeyPressed = !!frequency;
    const isAlreadyPlaying = !!this.props.keys[letter];

    if (isValidKeyPressed && !isAlreadyPlaying) {
      this.props.pressKey({ letter, frequency })
    }
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
      <div className="keyboard" onKeyPress={this.handlePress}>
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
