process.env.NODE_ENV = 'production';

const path = require('path');
const rimrafSync = require('rimraf').sync;
const webpack = require('webpack');
const config = require('../config/webpack.config.prod');
const { exec } = require('child_process');

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

  // Copy `sample-cassette-actions.json` to /build
  exec('cp sample-cassette-actions.json build/sample-cassette-actions.json');


  const openCommand = process.platform === 'win32' ? 'start' : 'open';
  console.info('Successfully generated a bundle in the build folder!');
  console.info();
  console.info('You can now serve it with any static server, for example:');
  console.info('  cd build');
  console.info('  npm install -g http-server');
  console.info('  hs');
  console.info('  ' + openCommand + ' http://localhost:8080');
  console.info();
  console.info('The bundle is optimized and ready to be deployed to production.');
});
