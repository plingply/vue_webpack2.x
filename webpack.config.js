var path = require('path')
var webpack = require('webpack')

var htmlWebpackPlugin = require("html-webpack-plugin");

var urlObj = {
    build: "/",
    dev: "/"
}


var ExtractTextPlugin = require("extract-text-webpack-plugin");

var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var publicPath = process.env.NODE_ENV === 'production' ? urlObj.build : urlObj.dev;

var plugin = new ExtractTextPlugin({
    filename: "css/style.css",
    disable: process.env.NODE_ENV === "development"
})

var entry_pro = {
    commenVue: ["vue"],
    main: './src/js/main.js'
}

var entry_dev = {
    commenVue: ["vue", hotMiddlewareScript],
    main: ['./src/js/main.js', hotMiddlewareScript]
}


module.exports = {
    entry: process.env.NODE_ENV === "production" ? entry_pro : entry_dev,
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: publicPath,
        filename: 'js/[name].js'
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    //提取vue组件中的css
                    extractCSS: plugin
                }
            },
            {
                test: /\.js$/,
                use: [{
                    loader: "babel-loader"
                }],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                //提取css文件中的css
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",
                    use: "postcss-loader"
                }),
                exclude: '/node_modules/'
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            strictMath: false,
                            noIeCompat: true
                        }
                    }
                ],
                exclude: '/node_modules/'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 1000,
                    name: 'img/[name].[ext]?[hash:7]'
                },
                exclude: '/node_modules/'
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'css/fonts/[name].[ext]'
                },
                exclude: '/node_modules/'
            }
        ]
    },
    plugins: [

        //提取css 这里只能提取import 引入的css、
        plugin,
        new htmlWebpackPlugin({
            template: "src/index.html",
            inject: 'body',
            filename: "index.html",
            minify: { //页面压缩
                removeComments: false, //删除注释
                collapseWhitespace: false, //去空格
                minifyCSS: false, //压缩CSS
                minifyJS: false, //压缩JS
                removeEmptyAttributes: false //删除空白属性
            }

        }),
        //热更新
        new webpack.HotModuleReplacementPlugin(),
        //提取公共JS
        new webpack.optimize.CommonsChunkPlugin({ name: 'commenVue', filename: 'js/commenVue.js' }),

        new webpack.BannerPlugin("Copyright © 2014-2017 Learning Tech Co.,Ltd. 陕ICP备15001970-2号") //在css js头部插入注释

    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.min.js'
        }
    },

    performance: {
        hints: false
    },

    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
        // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}