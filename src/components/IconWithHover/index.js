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
    const { value, hoverValue, color, size } = this.props;

    return (
      <span
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
      >
        <Icon
          value={this.state.hover ? hoverValue : value}
          color={color}
          size={size}
        />
      </span>
    );
  }
}

IconWithHover.propTypes = {
  value: PropTypes.string.isRequired,
  hoverValue: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
};

export default IconWithHover;
