/**
 * postcss.config
 */

module.exports = {
    plugins: [
        require('pixrem')({ /* ...options */ }),
        require('autoprefixer')({
            browsers: ['last 8 version', '> 1%', 'ie 9', 'ie 8', 'ie 7', 'ios 6', 'Firefox <= 20'],
            cascade: false
        })
    ]
};
