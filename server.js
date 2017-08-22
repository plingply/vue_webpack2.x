var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var compiler = webpack(webpackConfig);
var express = require("express");
var path = require("path")

var httpProxy = require('http-proxy');

var app = express();


// 新建一个代理 Proxy Server 对象  
var proxy = httpProxy.createProxyServer();


//设置静态资源
app.use(express.static(path.resolve(__dirname, "dist")));

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: false,
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
}));

app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log,
    reload: true,
    path: "/__webpack_hmr",
    heartbeat: 2000
}));

app.all("/api/*", function(req, res) {
    delete req.headers.host;
    proxy.web(req, res, { target: 'http://v2.eduwxt.com' });
})

app.get("/upload/*", function(req, res) {
    delete req.headers.host;
    proxy.web(req, res, { target: 'http://v2.eduwxt.com' });
})

app.listen(8080, function() {
    var c = require('child_process');
    c.exec('start http://127.0.0.1:8080');
})