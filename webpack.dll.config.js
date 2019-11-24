const webpack = require('webpack')
const library = 'my_lib'
const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        vendors: ['vue', 'axios']
    },

    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, 'dll/'),
        library
    },

    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'dll/[name]-manifest.json'),
            // This must match the output.library option above
            name: library
        }),
    ],
}
