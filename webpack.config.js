var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //webpack4的css独立打包方式
// 环境变量配置，dev / online 
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

// 获取html-webpack-plugin参数的方法 
var getHtmlConfig = function(name, title) {
	return {
		template: './src/view/' + name + '.html',
		filename: 'view/' + name + '.html',
		title: title,
		inject: true,
		hash: true,
		chunks: ['common', name]
	};
};
// webpack config 
var config = {
	/* * 【新增】：新增mode参数，webpack4中要指定模式，可以放在配置文件这里，也可以放在启动命令里，如--mode production */
	mode: 'dev' === WEBPACK_ENV ? 'development' : 'production',
	/* * 【改动】：删除了入口文件的中括号，可选的改动，没什么影响 */
	entry: {
		'common': './src/page/common/index.js',
		'index': './src/page/index/index.js',
		'about': './src/page/about/index.js',
	},
	
	output: {
		/* * 【改动】：删除path的配置，在webpack4中文件默认生成的位置就是/dist, * 而publicPath和filename特性的设置要保留 */
		// path : __dirname + '/dist/', 
		publicPath: 'dev' === WEBPACK_ENV ? '/dist/' : '//s.happymmall.com/mmall-fe/dist/',
		filename: 'js/[name][hash:5].js'
	},
	
	externals: {
		'jquery': 'window.jQuery'
	},
	module: {
		/* * 【改动】：loader的使用中，loaders字段变为rules，用来放各种文件的加载器，用rules确实更为贴切 */
		rules: [
			/* * 【改动】：css样式的加载方式变化 */ // css文件的处理
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							minimize: true
						}
					}
				]
			},
			{
				test: /\.styl$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'stylus-loader'
				]
			},
			/* * 【改动】：模板文件的加载方式变化 */ // 模板文件的处理 
			{
				test: /\.string$/,
				use: {
					loader: 'html-loader',
					options: {
						minimize: true,
						removeAttributeQuotes: false
					}
				}
			},
			/* * 【改动】：图片文件的加载方式变化，并和字体文件分开处理 */ // 图片的配置 
			{
				test: /\.(png|jpg|gif)$/,
				use: [{
					loader: 'url-loader',
					options: { /* * 【改动】：图片小于2kb的按base64打包 */
						limit: 2048,
						name: 'resource/[name][hash:5].[ext]'
					}
				}]
			},
			/* * 【改动】：字体文件的加载方式变化 */ // 字体图标的配置 
			{
				test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 8192,
						name: 'resource/[name].[ext]'
					}
				}]
			}
		]
	},
	resolve: {
		alias: {
			node_modules: __dirname + '/node_modules',
			util: __dirname + '/src/util',
			page: __dirname + '/src/page',
			service: __dirname + '/src/service',
			image: __dirname + '/src/image'
		}
	},
	/* * 【新增】：webpack4里面移除了commonChunksPulgin插件，放在了config.optimization里面 */
	optimization: {
		//	runtimeChunk: {
		//  name: "manifest"
		//},
		splitChunks: {
			cacheGroups: {
				common: {
					name: "common",
					chunks: "all",
					minChunks: 2
				},
				vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    priority: -20,
                    chunks: "all"
                }
			}
		}
	},
	devServer: {
		port: 8080,
		inline: true,
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[name][hash:5].css',
		}),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
		new HtmlWebpackPlugin(getHtmlConfig('about', '关于'))
	]
}
if(WEBPACK_ENV != 'dev'){
	config.plugins.push(
		new CleanWebpackPlugin(['dist']),
	)
}
module.exports = config;