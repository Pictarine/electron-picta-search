const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');
const UglifyEsPlugin = require('uglify-es-webpack-plugin')

const plugins = [
  new webpack.BannerPlugin(`
    (c) Copyright 2018. Vu Tran
    Website: https://github.com/DextApp/dext/
    Developer: Vu Tran <vu@vu-tran.com>
    Forked by Pictarine Inc.
  `),
];

const prodConfig = merge({}, baseConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyEsPlugin({
        compress: {
          drop_console: true
        }
      }),
    ],
    minimize: true,
  },
  plugins,
});

module.exports = prodConfig;
