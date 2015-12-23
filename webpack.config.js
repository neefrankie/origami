var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
	app: path.join(__dirname, 'es6'),
	build: path.join(__dirname, 'build')
};

module.exports = {
	entry: PATHS.app,
	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel?presets[]=es2015',
				include: PATHS.app
			},
			{
				test: /\.scss$/,
        		loaders: ["style", "css", "sass"]
			}
		]
	},
	sassLoader: {
	   includePaths: [path.resolve(__dirname, "./bower_components")]
	},
/*	devServer: {
		historyApiFallback: true,
		hot: true,
		inline: true,
		progress: true,
		stats: 'error-only',
		host: process.env.HOST,
		port: process.env.PORT
	},*/
	plugins: [
		/*new webpack.HotModuleReplacementPlugin(),*/
		new HtmlWebpackPlugin({
			template: 'app/webpack.html',
			inject: 'body'
		})
	]
};