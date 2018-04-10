/*
* @Author: Rosen
* @Date:   2017-05-08 15:28:19
* @Last Modified by:   Rosen
* @Last Modified time: 2018-03-27 13:10:36
*/
var webpack             = require('webpack');
var ExtractTextPlugin   = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin   = require('html-webpack-plugin');

// 环境变量配置，dev / online
var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name, title){
    return {
        template    : './src/view/' + name + '.html',
        filename    : 'view/' + name + '.html',
        favicon     : './favicon.ico',
        title       : title,
        inject      : true,
        hash        : true,
        // 打包的时候，允许被注入的js文件，这个项目是common里的index.js
        // name也是打包时候注入的js文件，根据传入的不同值，传入不同的js（这个js是entry里面传入后打包的js文件）
        chunks      : ['common', name]
    };
};
// webpack config
var config = {
    /*
    * 【新增】：新增mode参数，webpack4中要指定模式，可以放在配置文件这里，也可以放在启动命令里，如--mode production
    */
    mode : 'dev' === WEBPACK_ENV ? 'development' : 'production',
    /*
    * 【改动】：删除了入口文件的中括号，可选的改动，没什么影响
    */
    entry: {
        'common'            : './src/page/common/index.js',
        'index'             : './src/page/index/index.js',
        'result'            : './src/page/result/index.js',
      // 'list'              : './src/page/list/index.js',
      // 'detail'            : './src/page/detail/index.js',
      // 'cart'              : './src/page/cart/index.js',
      // 'order-confirm'     : './src/page/order-confirm/index.js',
      // 'order-list'        : './src/page/order-list/index.js',
      // 'order-detail'      : './src/page/order-detail/index.js',
      // 'payment'           : './src/page/payment/index.js',
      'user-login'        : './src/page/user-login/index.js'
      // 'user-register'     : './src/page/user-register/index.js',
      // 'user-pass-reset'   : './src/page/user-pass-reset/index.js',
      // 'user-center'       : './src/page/user-center/index.js',
      // 'user-center-update': './src/page/user-center-update/index.js',
      // 'user-pass-update'  : './src/page/user-pass-update/index.js',
      // 'about'             : './src/page/about/index.js',
    },
    output: {
        /*
        * 【改动】：删除path的配置，在webpack4中文件默认生成的位置就是/dist,
        *  而publicPath和filename特性的设置要保留
        */
        // path        : __dirname + '/dist/',
        publicPath  : 'dev' === WEBPACK_ENV ? '/dist/' : '//s.happymmall.com/mmall-fe/dist/',
        filename    : 'js/[name].js'
    },
    // 引用一个库，又不想让webpack打包，就用externals
    externals : {
        'jQuery' : 'window.jQuery'
    },
    module: {
        /*
        * 【改动】：loader的使用中，loaders字段变为rules，用来放各种文件的加载器，用rules确实更为贴切
        */
        rules: [
            /*
            * 【改动】：css样式的加载方式变化
            */
            // css文件的处理
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            /*
            * 【改动】：模板文件的加载方式变化
            */
            // 模板文件的处理
            {
                test: /\.string$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize : true,
                        removeAttributeQuotes : false
                    }
                }
            },
            /*
            * 【改动】：图片文件的加载方式变化，并和字体文件分开处理
            */
            // 图片的配置
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            /*
                            * 【改动】：图片小于2kb的按base64打包
                            */
                            limit: 2048,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            },
            /*
            * 【改动】：字体文件的加载方式变化
            */
            // 字体图标的配置
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    resolve : {
        alias : {
            node_modules    : __dirname + '/node_modules',
            util            : __dirname + '/src/util',
            page            : __dirname + '/src/page',
            service         : __dirname + '/src/service',
            image           : __dirname + '/src/image'
        }
    },
    /*
    * 【新增】：webpack4里面移除了commonChunksPulgin插件，放在了config.optimization里面
    */
    optimization:{
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                common: {
                    name: "common",
                    chunks: "all",
                    minChunks: 2
                }
            }
        }
    },
    plugins: [
        /*
        * 【移除】：webpack4里面移除了commonChunksPulgin插件
        */
        // // 独立通用模块到js/base.js
        // new webpack.optimize.CommonsChunkPlugin({
        //     name : 'common',
        //     filename : 'js/base.js'
        // }),
        // 把css单独打包到文件里
        new ExtractTextPlugin("css/[name].css"),
        // html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
        new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户登录'))
    ],
    /*
    * 【新增】：在v1.0.1版本中新增了devServer的配置，用自带的代理就可以访问接口
    */
    devServer: {
        port: 8088,
        inline: true,
        proxy : {
            '**/*.do' : {
                target: 'http://test.happymmall.com',
                changeOrigin : true
            }
        }
    }

};


module.exports = config;
