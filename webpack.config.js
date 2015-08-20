'use strict';
var path = require('path');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var merge = require('webpack-merge');

var TARGET = process.env.npm_lifecycle_event;
var APP_DIR = path.resolve(__dirname, 'app');

var common = {
  resolve: {
    extensions: [
      '', '.js', '.jsx', '.css'
    ],
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  }
};

if (TARGET === 'start') {
  var IP = 'localhost'; // '0.0.0.0'; for wlan (not on win!)
  var PORT = 3000;

  module.exports = merge(common, {
    ip: IP,
    port: PORT,
    devtool: 'eval-source-map',
    entry: [
      'webpack-dev-server/client?http://' + IP + ':' + PORT,
      'webpack/hot/only-dev-server',
      APP_DIR
    ],
    output: {
      path: __dirname,
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development'),
        }
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin()
    ],
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['react-hot', 'babel'],
          include: [APP_DIR]
        }
      ]
    }
  });
}
else {
  module.exports = merge(common, {
    entry: {
      app: APP_DIR,
      vendors: ['react']
    },
    output: {
      path: './gh-pages',
      filename: 'bundle.[chunkhash].js',
    },
    plugins: [
      new Clean(['gh-pages']),
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          'NODE_ENV': JSON.stringify('production'),
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.[chunkhash].js'),
      new HtmlWebpackPlugin({
        title: 'Reports application'
      })
    ],
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['babel'],
          include: [APP_DIR],
        }
      ]
    }
  });
}
