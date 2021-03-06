const path = require("path");
const commonConfig = require("./webpack.common.config");
const merge = (...objs) => require("deepmerge").all(objs, {arrayMerge: (arr1, arr2) => arr1.concat(arr2) });

const combinedConfig = merge({}, commonConfig, {
	output: {
		publicPath: "app",
		path: path.resolve(__dirname, "./dist"),
		libraryTarget: "var",
		filename: "[name].[chunkhash].js"
	},
	devtool: "#source-map",
});

module.exports = combinedConfig;
