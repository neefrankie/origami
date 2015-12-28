'use strict'
var path = require('path');
var BowerWebpackPlugin = require("bower-webpack-plugin");

const PATHS = {
	app: path.join(__dirname, 'app/index.js'),
	build: path.join(__dirname, '.tmp')
}

module.exports = {
	entry: PATHS.app,
	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	},
	plugins: [new BowerWebpackPlugin({
		moduleDirectories: ['bower_components'],
		manifestFiles: 'bower.json',
		indlucdes: /\.js$/
	})]
};