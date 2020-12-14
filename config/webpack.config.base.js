const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //webpack4的css独立打包方式
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清除dist包

const NODE_ENV = process.env.NODE_ENV || 'dev';

// 获取html-webpack-plugin参数的方法
const getHtmlConfig = (name, title) => ({
  template : `./src/view/${name}.html`,
  filename :  `${name}.html`,
  title : title,
  inject : true,
  hash: true, //防止缓存 
  inject: true,
  chunks : ['common', name]
})
const config = {
  //devtool: "#source-map",
  // 入口
  entry: {
    'index' : './src/page/index/index.js',
    'about' : './src/page/about/index.js'
  },
  //出口
  output: {

    path: path.resolve(__dirname,'../dist'),
    filename: 'js/[name][hash:5].js',
    publicPath: '/'
  },
  module: {
    rules:[
      // es6打包
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, '../src')],
        use: [
          {
            loader:'babel-loader',
            options: {
              cacheDirectory: true, //缓存
            }
          },
          {
            loader:  'eslint-loader',
            options:{
              formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
            }
          }
        ]
      },
      // 字体文件的加载方式
      {
        test:/\.(eot|svg|ttf|woff|otf)$/,
        use:[
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 超过8k压缩
              name: 'fonts/[name][hash:5].[ext]' //打包后的文件名
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
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.styl$/,
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'stylus-loader',
        ]
      },
      {
        test: /\.less$/,
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use:[
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'img/[name][hash:5].[ext]'
            }
          }
        ]
      }
    ]
  },/* * 【新增】：webpack4里面移除了commonChunksPulgin插件，放在了config.optimization里面 */
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          name: "common",
          chunks: "all",
          minChunks: 2
        },
        vendor: {
          test: /node_modules/,
          name: "vendors",
          priority: -20,
          chunks: "all"
        }
      }
    }
  },
  resolve:{
    extensions:['.js', '.css', '.json', '.tpl'],
    alias: {
      'css':  path.resolve(__dirname, '../src/css'),
      'page': path.resolve(__dirname, '../src/page'),
      'img': path.resolve(__dirname, '../src/img'),
      'fonts': path.resolve(__dirname, '../src/fonts'),
      'view': path.resolve(__dirname, '../src/view'),
      'api': path.resolve(__dirname, '../src/api'),
      'service': path.resolve(__dirname, '../src/service')
    }
  },
  plugins:[
    
    new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
    new HtmlWebpackPlugin(getHtmlConfig('about', '关于')),
  ]
}
if(NODE_ENV != 'dev'){
  config.plugins.push(
    new CleanWebpackPlugin(['dist']),
  )
}
module.exports = config;