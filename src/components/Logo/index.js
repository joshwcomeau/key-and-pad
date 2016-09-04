import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './index.scss';

const Logo = ({ size, isAdmin }) => (
  <span className={classNames('logo', size, { 'is-admin': isAdmin })}>
    <span className="word">Key</span>
    <span className="join-character">&</span>
    <span className="word">Pad</span>
  </span>
);

Logo.propTypes = {
  size: PropTypes.string,
  isAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAdmin: state.isAdmin,
});

export default connect(mapStateToProps)(Logo);
