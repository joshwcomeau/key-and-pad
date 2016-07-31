import React, { PureComponent, PropTypes } from 'react';

import Icon from '../Icon';

class IconCycle extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      value: props.values[0],
    };
  }

  componentDidMount() {
    this.cycle = window.setInterval(() => {
      const nextIndex = (this.state.index + 1) % this.props.values.length;

      this.setState({
        index: nextIndex,
        value: this.props.values[nextIndex],
      });
    }, this.props.speed)
  }

  componentWillUnmount() {
    window.clearInterval(this.cycle);
  }

  render() {
    const { values, speed, styles, ...delegated } = this.props;

    return (
      <Icon
        {...delegated}
        value={this.state.value}
        style={this.props.styles[this.state.index % this.props.styles.length]}
      />
    )
  }
}

IconCycle.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  speed: PropTypes.number,
  styles: PropTypes.arrayOf(PropTypes.object),
};

IconCycle.defaultProps = {
  speed: 500,
};

export default IconCycle;
