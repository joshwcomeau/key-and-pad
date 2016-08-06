import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  casettesListRequest,
  selectCasette,
  play ,
} from '../../ducks/vcr-player.duck';
import VCR from '../VCR';
import CasetteList from '../CasetteList';

import './index.scss';


class ReduxVCR extends Component {
  componentDidMount() {
    this.props.casettesListRequest();

    setTimeout(() => {
      this.props.selectCasette({ id: '1ddbfcb2-e0fd-44bc-a159-f1e765f4f9b8' })
    }, 2000)
  }

  render() {
    const { position, play } = this.props;

    const classes = classNames('redux-vcr-component', position);

    return (
      <div className={classes}>
        <VCR handleClickPlay={play} />
        <CasetteList />
      </div>
    );
  }
}

ReduxVCR.propTypes = {
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ]),
};

ReduxVCR.defaultProps = {
  position: 'bottom-left',
};



export default connect(null, { casettesListRequest, selectCasette, play })(ReduxVCR);
