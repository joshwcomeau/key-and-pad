import React, { PropTypes } from 'react';

import Icon from '../Icon';
import './index.scss';


const Error = ({ heading, content, linkText, linkHref, linkTarget }) => (
  <div className="error">
    <Icon value="error" color="#F35638" size={96} />
    <h3>{heading}</h3>
    <p>{content}</p>
    <p className="error-link">
      <a href={linkHref} target={linkTarget}>{linkText}</a>
    </p>
  </div>
);

Error.propTypes = {
  heading: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  linkText: PropTypes.string,
  linkHref: PropTypes.string,
  linkTarget: PropTypes.oneOf(['_self', '_blank']),
};

Error.defaultProps = {
  linkTarget: '_self',
};

export default Error;
