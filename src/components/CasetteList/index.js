import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as actionCreators from '../../ducks/vcr-player.duck';
import Casette from '../Casette';
import './index.scss';


class CasetteList extends Component {
  constructor(props) {
    super(props);

    this.animateCasetteSelection = this.animateCasetteSelection.bind(this);
    this.renderCasette = this.renderCasette.bind(this);

    // While the actual `selectedCasette` value lives in the redux store,
    // we want to animate the selection process. Therefore, we first set this
    // component's local state, base the animation off of it, and when it's
    // complete we dispatch the action to change the actual value.
    this.state = {
      selectedCasette: null,
    };
  }

  animateCasetteSelection({ id }) {
    this.setState({
      selectedCasette: id,
    });

    window.setTimeout(() => {
      this.props.selectCasette({ id });
    }, 1000);
  }

  renderCasette(id) {
    const { casettes } = this.props;
    const { selectedCasette } = this.state;

    const classes = classNames({
      'casette-wrapper': true,
      'fading-away': selectedCasette && selectedCasette !== id,
      'selected': selectedCasette === id,
    });

    return (
      <div key={id} className={classes}>
        <Casette
          sessionName={id}
          handleClick={this.animateCasetteSelection}
          {...casettes[id]}
        />
      </div>
    );
  }

  render() {
    const casetteIds = Object.keys(this.props.casettes);

    return (
      <div className="casette-list">
        {casetteIds.map(this.renderCasette)}
      </div>
    );
  }
}

CasetteList.propTypes = {
  casettes: PropTypes.object,
  selectCasette: PropTypes.func,
};

CasetteList.defaultProps = {
};

const mapStateToProps = state => ({
  casettes: state.vcrPlayer.casettes,
});

export default connect(mapStateToProps, {
  selectCasette: actionCreators.selectCasette,
})(CasetteList);
