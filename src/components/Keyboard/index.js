import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
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
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handlePress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlePress);
  }

  handlePress(ev) {
    const letter = keycode(ev).toUpperCase();
    const frequency = keyboardFrequencies[letter];
  }

  renderRow(row, index) {
    return (
      <div className="keyboard-row" key={index}>
        {row.map(key => <Key key={key.letter} {...key} />)}
      </div>
    );
  }

  render() {
    return (
      <div className="keyboard" onKeyDown={this.handlePress}>
        {this.props.layout.map(this.renderRow)}
      </div>
    );
  }
}

Keyboard.PropTypes = {
  layout: PropTypes.arrayOf(PropTypes.array).isRequired,
};


const mapStateToProps = state => ({
  keys: state.keys,
});

export default connect(mapStateToProps, )(Keyboard);
