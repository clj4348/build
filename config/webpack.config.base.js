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
  chunks : ['vendors', 'common', name]
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
          // {
          //   loader:  'eslint-loader',
          //   options:{
          //     formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
          //   }
          // }
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
              limit: 5 * 1024,
              name: 'img/[name][hash:5].[ext]'
            }
          }
        ]
      }
    ]
  },/* * 【新增】：webpack4里面移除了commonChunksPulgin插件，放在了config.optimization里面 */
  optimization: {
    splitChunks: {
      chunks: "all",
      /**
       * 分割代码块
       * inital 入口 chunk，对于异步导入的文件不处理
       * async 异步 chunk，只对异步导入的文件处理
       * all 全部 chunk
       */
      
      // 缓存分组
      cacheGroups: {
        // 公共的模块
        common: {
          name: "common",
          priority: 0, // 优先级
          minSize: 0, // 大小限制
          minChunks: 2 // 公共模块最少复用过几次
        },
        // 第三放模块
        vendor: {
          test: /node_modules/,
          name: "vendors",
          priority: 1, // 权限更高，优先抽离
          minSize: 0, // 大小限制
          minChunks: 1 // 最少服用过几次
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

module.exports = config;
