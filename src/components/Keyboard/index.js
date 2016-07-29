import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import keycode from 'keycode';

import Key from '../Key';
import { addNote, removeNote } from '../../ducks/notes.duck';
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
    const noteValue = keyboardNotes[letter];

    if (shouldTriggerAddNote(ev, noteValue, currentNotes: this.props.nodes)) {
      this.props.addNote({ value: noteValue, letter })
    }
  }

  handleRelease(ev) {
    // TODO: Use a method from keyboard-helpers
    const letter = keycode(ev).toUpperCase();
    const note = keyboardNotes[letter]
    const frequency = toFreq(noteValue);

    const isValidKeyPressed = !!frequency;
    const isAlreadyPlaying = this.props.notes.find(note => (
      note.value === noteValue
    ));
    const isSpecialKeyPressed = !!ev.metaKey || !!ev.ctrlKey || !!ev.shiftKey;

    this.props.removeNote({ value: note });
  }

  renderKey({ letter, keyStyle }) {
    // TODO: This might be a perf bottleneck, doing the `find` on every
    // render for every key.
    return (
      <Key
        key={letter}
        letter={letter}
        keyStyle={keyStyle}
        active={this.props.notes.find(note => note.letter === letter)}
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
  notes: PropTypes.arrayOf(PropTypes.string),
  addNote: PropTypes.func.isRequired,
  removeNote: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  notes: state.notes,
});

export default connect(mapStateToProps, { addNote, removeNote })(Keyboard);
