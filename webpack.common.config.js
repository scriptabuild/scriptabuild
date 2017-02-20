const nodeExternals = require("webpack-node-externals");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const babelPresetLatest = ["latest", {"es2015": {"modules": false}}];

module.exports = {
	entry: [
		"./source/master/index.js"
	],
	resolve: {
		extensions: ['.js']
	},
	module: {
		rules: [{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [ babelPresetLatest ],
						plugins: ["transform-object-rest-spread"]
					}
				}
			}
		]
	},
	plugins: [
	]
}