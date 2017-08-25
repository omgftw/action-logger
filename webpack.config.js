var webpack = require('webpack');
var path = require('path');

var babelOptions = {
    "presets": [
        [
            "es2015",
            {
                "modules": false
            }
        ],
        "es2016"
    ]
};

module.exports = {
    entry: "./index.js",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "actionLogger.js"
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new webpack.DefinePlugin({
            DEBUG_MODE: JSON.stringify(true)
        })
    ]
};
