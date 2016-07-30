import React from 'react';
import ReactSelect from 'react-select';
import classNames from 'classnames';

import 'react-select/dist/react-select.css';
import './index.scss';

const Select = ({ className, ...args }) => (
  <ReactSelect className={classNames('select', className)} {...args} />
);

export default Select;
