const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
module.exports = {
    entry: {
        app: "./demo/index.ts",
    },
    mode: "development",
    output: {
        filename: '[name].js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: [ ".js", ".ts" ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/i,
                use: [ {
                    loader: MiniCssExtractPlugin.loader
                }, 'css-loader' ],
            }
        ]
    },

    devServer: {
        contentBase: "./dist"
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            chunks: [ 'app' ],
            template: './index.html',
            filename: 'index.html',

            minify: { minifyCSS: true, minifyJS: true, removeComments: true }
        }),
    ]
};