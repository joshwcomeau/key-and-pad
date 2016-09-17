/* eslint-disable no-undef */
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  module.exports = require('./configure-store.prod');
} else if (process.env.NODE_ENV === 'test') {
  module.exports = require('./configure-store.test');
} else {
  // eslint-disable-next-line global-require
  module.exports = require('./configure-store.dev');
}
