const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //webpack4的css独立打包方式
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJs = require('uglifyjs-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV || 'dev';

// 获取html-webpack-plugin参数的方法
const getHtmlConfig = (name, title) => ({
	template : `./src/view/${name}.html`,
	filename : 	`view/${name}.html`,
	title : title,
	inject : true,
	hash: true, //防止缓存
	inject: true,
	chunks : ['common', name]
})
const config = {
	/**
	 * [新增]：新增mode参数，webpack4中要指定模式，可以放在配置文件这里 可以放在命令
	 * */
	mode : 'dev' ===  NODE_ENV ? 'development' : 'production',
	devtool: "#source-map",
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
		publicPath: '../'
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
				test:/\.(eot|svg|ttf|woff2|otf)$/,
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
							importLoaders: 1,
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
			{
				test: /\.(jpe?g|png|gif)$/,
				use:[
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: 'resourece/[name].[ext]'
						}
					}
				]
			}
		]
	},
	optimization: {
	    minimize: false, //是否进行代码压缩
	    splitChunks: {
	      chunks: "async",
	      minSize: 30000, //模块大于30k会被抽离到公共模块
	      minChunks: 1, //模块出现1次就会被抽离到公共模块
	      maxAsyncRequests: 5, //异步模块，一次最多只能被加载5个
	      maxInitialRequests: 3, //入口模块最多只能加载3个
	      name: true,
	      cacheGroups: {
	        default: {
	          minChunks: 2,
	          priority: -20,
	          reuseExistingChunk: true,
	        },
	        vendors: {
	          test: /[\\/]node_modules[\\/]/,
	          priority: -10
	        }
	      }
	    },
	    runtimeChunk: {
	      name: "runtime"
	    }
	 },
	devServer: {
		port:8080, 
        inline: true
	},
	plugins:[
		new MiniCssExtractPlugin({
			filename: 'css/[name][hash:5].css',
		}),
		new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
		new HtmlWebpackPlugin(getHtmlConfig('about', '关于'))
	]
}
if(NODE_ENV != 'dev'){
	config.plugins.push(
		new CleanWebpackPlugin(['dist']),
	)
}
module.exports = config;