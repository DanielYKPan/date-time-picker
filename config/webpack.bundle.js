/**
 * webpack.bundle
 */

var webpack = require('webpack');
var helpers = require('./helpers');

module.exports = {
    devtool: 'source-map',

    entry: {
        'picker': './dist/lib/picker.module.js'
    },

    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [helpers.root('dist'), helpers.root('node_modules')],
    },

    output: {
        // options related to how webpack emits results

        path: helpers.root('dist/lib'), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)

        filename: "picker.module.bundle.js", // string
        // the filename template for entry chunks

        library: "DateTimePicker", // string,
        // the name of the exported library

        libraryTarget: "umd", // universal module definition
        // the type of the exported library

        /* Advanced output configuration (click to show) */
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

        new webpack.optimize.CommonsChunkPlugin({
            name: ['picker']
        }),
    ]
};
