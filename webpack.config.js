var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  css: [
    path.join(__dirname, 'app'),
    path.join(__dirname, 'node_modules/purecss')
  ]
};

var common = {
  entry: PATHS.app,
  resolve: {
    extensions: [
      '', '.js', '.jsx', '.css'
    ],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: [PATHS.app]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Reports application'
    })
  ]
};

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // display only errors to reduce the amount of output
      stats: 'errors-only',

      // parse host and port from env so this is easy
      // to customize
      host: process.env.HOST,
      port: process.env.PORT
    },
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: PATHS.css
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

if(TARGET === 'build') {
  module.exports = merge(common, {
    entry: {
      app: PATHS.app,
      vendors: ['react']
    },
    output: {
      path: PATHS.build,
      filename: '[name].[chunkhash].js',
    },
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: PATHS.css
        }
      ]
    },
    plugins: [
      new Clean([PATHS.build]),
      new ExtractTextPlugin('styles.[chunkhash].css'),
      new webpack.DefinePlugin({
        // This has effect on the react lib size
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.CommonsChunkPlugin(
        'vendors',
        '[name].[chunkhash].js'
      )
    ]
  });
}
