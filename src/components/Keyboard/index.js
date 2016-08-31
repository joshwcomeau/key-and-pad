import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import { addNote, removeNote } from '../../actions';
import {
  shouldEventTriggerAction,
  getNoteAndLetter,
} from '../../utils/keyboard-helpers';

import Key from '../Key';
import Tooltip from '../Tooltip';
import './index.scss';


class Keyboard extends PureComponent {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.handleRelease = this.handleRelease.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.renderKey = this.renderKey.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = { showNoClickTooltip: false };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handlePress);
    window.addEventListener('keyup', this.handleRelease);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlePress);
    window.removeEventListener('keyup', this.handleRelease);
  }

  handleClick() {
    this.setState({ showNoClickTooltip: true });
  }

  handlePress(ev) {
    if (!this.props.enabled) {
      return;
    }

    this.setState({ showNoClickTooltip: false });

    const [noteValue, letter] = getNoteAndLetter(ev);
    const isValid = shouldEventTriggerAction({
      ev,
      noteValue,
      currentNotes: this.props.notes,
      mode: 'press',
    });

    if (isValid) {
      this.props.addNote({ value: noteValue, letter });
    }
  }

  handleRelease(ev) {
    if (!this.props.enabled) {
      return;
    }

    const [noteValue] = getNoteAndLetter(ev);
    const isValid = shouldEventTriggerAction({
      ev,
      noteValue,
      currentNotes: this.props.notes,
      mode: 'release',
    });

    if (isValid) {
      this.props.removeNote({ value: noteValue });
    }
  }

  renderKey({ letter, keyStyle }) {
    // TODO: This might be a perf bottleneck, doing the `find` on every
    // render for every key.
    return (
      <Key
        key={letter}
        letter={letter}
        keyStyle={keyStyle}
        active={!!this.props.notes.find(note => note.letter === letter)}
      />
    );
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
      <div className="keyboard" onClick={this.handleClick}>
        {this.props.layout.map(this.renderRow)}
        <Tooltip
          shown={this.state.showNoClickTooltip}
          text="Use your actual keyboard to play!"
          position="top"
          autoHideDuration={2000}
          buffer={30}
        />
      </div>
    );
  }
}

Keyboard.propTypes = {
  layout: PropTypes.arrayOf(PropTypes.array).isRequired,
  enabled: PropTypes.bool,
  notes: PropTypes.arrayOf(PropTypes.object),
  addNote: PropTypes.func.isRequired,
  removeNote: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  notes: state.notes,
});

export const KeyboardPresentational = Keyboard;

export default connect(mapStateToProps, { addNote, removeNote })(Keyboard);
