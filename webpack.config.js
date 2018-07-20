const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //webpack4的css独立打包方式
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJs = require('uglifyjs-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV || 'dev'
// 获取html-webpack-plugin参数的方法
const getHtmlConfig = (name, title) => ({
	template : `./src/view/${name}.html`,
	filename : 	`view/${name}.html`,
	title : title,
	inject : true,
	hash: true, //防止缓存
	chunks : ['common', name]
})
const config = {
	/**
	 * [新增]：新增mode参数，webpack4中要指定模式，可以放在配置文件这里 可以放在命令
	 * */
	mode : 'dev' ===  NODE_ENV ? 'development' : 'production',
	// 入口
	entry: {
		'common': './src/page/common/index.js',
		'index' : './src/page/index/index.js',
		'about' : './src/page/about/index.js'
	},
	//出口
	output: {
		path: path.resolve(__dirname,'dist'),
		filename : 'js/[name][hash:5].js',
	},
	module: {
		rules:[
			// es6打包
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader:'babel-loader',
					options: {
						cacheDirectory: true //缓存
					}
				}
			},
			// 字体文件的加载方式
			{
				test:/\.(eot|svg|ttf|woff2|otf)%/,
				use:[
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: 'resourece/[name].[ext]'
						}
					}
				]
			},
			{
				test:/\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options:{
							minimize: true
						}
					}
				]
			},
			{
				test: /\.styl$/,
				use:[
					MiniCssExtractPlugin.loader,
					'css-loader',
					'stylus-loader'
				]
			},
			{
				test: /\.less$/,
				use:[
					MiniCssExtractPlugin.loader,
					'css-loader',
					'less-loader'
				]
			},
		]
	},
//	optimization:{
//		splitChunks: {
//			cacheGroups: {
//				vender: {
//					name: "initail",
//					chunks: 'all',
//					enforce: true
//				}
//			}
//		}
//	},
	devServer: {
		contentBase: path.join(__dirname, "dist"), //静态文件根目录
        port: 3544, // 端口
        host: 'localhost',
      	overlay: true,
      	compress: false
	},
	plugins:[

		new MiniCssExtractPlugin({
			filename: 'css/[name][hash:5].css'
		}),
		//new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
		new HtmlWebpackPlugin(getHtmlConfig('about', '关于'))
	]
	
}

module.exports = config;