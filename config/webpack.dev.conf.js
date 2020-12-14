const path = require('path')
const webpack = require('webpack');
const webpackConfigBase = require('./webpack.config.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //webpack4的css独立打包方式
const merge = require('webpack-merge');
const devConfig =  {
	devtool: "source-map", // 开启调试模式
	mode : 'development',
	devServer: {
		port: 8080,
		inline: true,
		hot: true,
		contentBase: path.join(__dirname, './', 'dist'),
		host: 'localhost',//主机地址
		proxy:  {
			'/api':{
				target: 'https://www.baidu.com', 
			}
		}
	},
	plugins:[
		new MiniCssExtractPlugin({
			filename: 'css/[name][hash:5].css',
		}),
		new webpack.HotModuleReplacementPlugin()
	]
}

module.exports = merge(devConfig, webpackConfigBase);