var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: 'http://localhost:8080/',
        filename: '[name].bundle.js',
        sourceMapFilename: '[file].map',
        chunkFilename: '[id].chunk.js',
        library: 'ac_[name]',
        libraryTarget: 'var'
    },

    module: {
        rules: [

            /*
             * css loader support for *.css files (styles directory only)
             * Loads external css styles into the DOM, supports HMR
             *
             */
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: [helpers.root('src', 'sass')]
            },

            /*
             * sass loader support for *.scss files (styles directory only)
             * Loads external sass styles into the DOM, supports HMR
             *
             */
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'resolve-url-loader', 'sass-loader'],
                include: [helpers.root('src', 'sass')]
            },
        ]
    },

    plugins: [
        new ExtractTextPlugin('[name].css')
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});
