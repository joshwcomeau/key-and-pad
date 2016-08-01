import React, { PureComponent, PropTypes } from 'react';

import Icon from '../Icon';

class IconWithHover extends PureComponent {
  constructor(props) {
    super(props);

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    this.state = {
      hover: false,
    };
  }

  handleMouseOver() {
    this.setState({ hover: true });
  }

  handleMouseLeave() {
    this.setState({ hover: false });
  }

  render() {
    const { value, hoverValue, ...delegated } = this.props;

    return (
      <span
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
      >
        <Icon
          {...delegated}
          value={this.state.hover ? hoverValue: value}
        />
      </span>
    )
  }
}

IconWithHover.propTypes = {
  value: PropTypes.string.isRequired,
  hoverValue: PropTypes.string.isRequired,
};

export default IconWithHover;
