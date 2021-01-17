const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        app: "./demo/index.ts",
    },
    mode: "development",

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
                use: [ 'style-loader', 'css-loader' ],
            }
        ]
    },

    devServer: {
        contentBase: "./dist"
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            template: './index.html',
            filename: 'index.html',

            minify: { minifyCSS: true, minifyJS: true, removeComments: true }
        }),
    ]
};