process.env.NODE_ENV = 'production';

const path = require('path');
const rimrafSync = require('rimraf').sync;
const webpack = require('webpack');
const config = require('../config/webpack.config.prod');

const isInNodeModules = 'node_modules' ===
  path.basename(path.resolve(path.join(__dirname, '..', '..')));
const relative = isInNodeModules ? '../..' : '.';
rimrafSync(relative + '/build');

webpack(config).run(function (err, stats) {
  if (err) {
    console.error('Failed to create a production build. Reason:');
    console.error(err.message || err);
    process.exit(1);
  }

  const openCommand = process.platform === 'win32' ? 'start' : 'open';
  console.log('Successfully generated a bundle in the build folder!');
  console.log();
  console.log('You can now serve it with any static server, for example:');
  console.log('  cd build');
  console.log('  npm install -g http-server');
  console.log('  hs');
  console.log('  ' + openCommand + ' http://localhost:8080');
  console.log();
  console.log('The bundle is optimized and ready to be deployed to production.');
});
