import React, { Component, PropTypes } from 'react';

import Key from '../Key';
import './index.css';


class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  renderRow(row) {
    return (
      <div className="keyboard-row">
        {row.map(key => <Key key={key.letter} {...key} />)}
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
};

export default Keyboard;
