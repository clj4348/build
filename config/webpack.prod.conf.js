const path = require('path')
const webpack = require('webpack');
const webpackConfigBase = require('./webpack.config.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //webpack4的css独立打包方式
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清除dist包 
const merge = require('webpack-merge');

const devConfig =  {
	devtool: "source-map", // 开启调试模式
	mode : 'production',
	plugins:[
		new MiniCssExtractPlugin({
			filename: 'css/[name][hash:5].css',
		}), 
		new CleanWebpackPlugin(['dist']),
	]
}

module.exports =merge(webpackConfigBase, devConfig);