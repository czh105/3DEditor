'use strict';
var http = require('http');
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('session');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var url = require('url');
//引入功能实现js
var credentials = require('./routes/credentials.js');
var login = require(__dirname + '/routes/login');
var file = require(__dirname + '/routes/file');//请求file模块
var zip = require(__dirname + '/routes/zipFile');
var app = express();

//设置端口
app.set('port', process.post || 8080);
//设置web工程的根目录
app.use(require('cookie-parser')(credentials.cookieSecret));
// 设置模板视图的目录
//app.set('views', path.join(__dirname, 'views'));
app.set('views', './public/pages');
//设置是否启用视图编译缓存，启用将加快服务器执行效率
app.set('view cache', true);
//设置模板引擎的格式即运用何种模板引擎
app.engine('html', ejs.__express);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//开始
//app.use('/home', login);
app.use('/', login);
app.post('/loginIn', login);
//注册功能
app.post('/registerIn',login);
app.post("/isUserId", login);
//1、用户删除功能
//1.1删除场景文件
app.post("/delUserScence", function (req, res) {
    var user_id = req.body['userid'];
    var file_name = req.body['filename'];
    file.deleteUserScenceFile(res, user_id, file_name);
});
//1.2删除图片文件
app.post('/delUserTexture', function (req, res) {
    var user_id = req.body['userid'];
    var picture_name = req.body['picturename'];
    file.deleteUserTextureFile(res, user_id, picture_name);
});
//1.3删除所有的暂时文件
app.post('/delUserAllTimeFile', function (req, res) {
    var user_id = req.body['userid'];
    file.delUserAllTimeFile(user_id);
    res.send("true");
});
//2、用户上传功能
//2.1用户上传到scence保存
app.post('/uploadScenceFile', function (req, res) {
    file.writeUserScenceFile(req,res);
});
app.post("/upload", function (req, res) {
    zip.unzipFolder(req, res);
});
//2.2用户上传到暂时文件夹(当用户退出之后会删除)
app.post("/uploadUserTimeFile", function (req, res) {    
    file.uploadFileToTimeFile(req, res);  
});
//2.3用户上传到Texture文件夹
app.post("/uploadUserTexturePicture", function (req, res) {
    console.log("app.js:uploadUserTexturePicture");
    console.log(req.cookies['userid']);
    file.uploadTexturePicture(req,res);
});
//用户创建场景文件夹
app.post("/createProjectFolder", function (req, res) {
    console.log("app.js createProjectFolder");
    console.log(req.body.userid);
    file.createProjectFolder(req, res);
    //fs.writeUserTextureFile(req, res);
    res.send(true);
});
//用户删除图片
app.post("/deleteUserTextureFile", function (req, res) {
    console.log("deleteUserTextureFile");
    file.deleteUserTextureFile(req, res);
});
//得到打包图片
app.get("/getMapFiles",function(req,res){
    zip.startZIPFile(req,res);
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// 开发错误处理程序
//将打印加亮
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
/*var server = app.listen(8080, function () {
    debug('Express server listening on port ' + server.address().port);
});*/
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("服务器端口：" + app.get('port'));
});//创建服务器监听
module.exports = app;