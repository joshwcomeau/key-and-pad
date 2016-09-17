/* eslint-disable no-undef */
export const numOfKeypressesNeeded = 8;
export const numOfPadUpdatesNeeded = process.env.NODE_ENV === 'production'
  ? 350
  : 10;
