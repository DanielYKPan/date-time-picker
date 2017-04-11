/**
 * webpack.test
 */

var webpack = require('webpack');
var helpers = require('./helpers');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                use: 'html-loader'

            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                use: 'null-loader'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                use: 'null-loader'
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                use: 'raw-loader'
            },
            /*
             * SCSS compile
             *
             * */
            {
                test: /\.scss$/,
                include: helpers.root('src', 'app'),
                use: ['raw-loader', 'css-loader', 'postcss-loader', 'resolve-url-loader', 'sass-loader']
            },
            {
                test: /\.scss$/,
                use: ['null-loader'],
                include: [helpers.root('src', 'sass')]
            },
        ]
    },

    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('src'), // location of your src
            {
                // your Angular Async Route paths relative to this root directory
            }
        ),
    ]
}
