const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// TODO: hide this behind a flag and eliminate dead code on eject.
// This shouldn't be exposed to the user.
const isInNodeModules = 'node_modules' ===
  path.basename(path.resolve(path.join(__dirname, '..', '..')));
let relativePath = isInNodeModules ? '../../..' : '..';
if (process.argv[2] === '--debug-template') {
  relativePath = '../template';
}
const srcPath = path.resolve(__dirname, relativePath, 'src');
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
const indexHtmlPath = path.resolve(__dirname, relativePath, 'index.html');
const faviconPath = path.resolve(__dirname, relativePath, 'favicon.png');
const buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'build');

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    path.join(srcPath, 'index'),
  ],
  output: {
    path: buildPath,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    // TODO: this wouldn't work for e.g. GH Pages.
    // Good news: we can infer it from package.json :-)
    publicPath: '/',
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {
      '_icons': path.join(__dirname, '..', 'src/icons'),
    },
  },
  resolveLoader: {
    root: nodeModulesPath,
    moduleTemplates: ['*-loader'],
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: srcPath,
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        include: srcPath,
        loader: 'babel',
        query: require('./babel.prod'),
      },
      {
        test: /\.s?css$/,
        include: [srcPath, nodeModulesPath],
        // Disable autoprefixer in css-loader itself:
        // https://github.com/webpack/css-loader/issues/281
        // We already have it thanks to postcss.
        loader: ExtractTextPlugin.extract('style', 'css?-autoprefixer!postcss!sass'),
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(jpg|png|gif|eot|ttf|woff|woff2)$/,
        loader: 'file',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline',
      },
      {
        test: /\.(mp4|webm)$/,
        loader: 'url?limit=10000',
      },
    ],
  },
  eslint: {
    // TODO: consider separate config for production,
    // e.g. to enable no-console and no-debugger only in prod.
    configFile: path.join(__dirname, 'eslint.js'),
    useEslintrc: false,
  },
  postcss() {
    return [autoprefixer];
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: indexHtmlPath,
      favicon: faviconPath,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
    new ExtractTextPlugin('[name].[contenthash].css'),
  ],
};
