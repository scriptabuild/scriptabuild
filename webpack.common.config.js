const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        app: [
            "./webapp-source/index.js",
            "./webapp-source/index.css"
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: [
                        ["env", { "modules": false }], "react"
                    ],
                    plugins: ["transform-object-rest-spread"]
                }
            }, {
                test: /\.html$/,
                use: "html-loader"
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",
                    publicPath: "/dist"
                })
            },
            {
                test: /.(png|woff|woff2|eot|ttf|svg)(\?.*)?$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 100000
                    }
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "[name].[chunkhash].css",
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "libs",
            minChunks(module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new HtmlWebpackPlugin({
            template: "./webapp-source/index.html"
        })
    ]
}