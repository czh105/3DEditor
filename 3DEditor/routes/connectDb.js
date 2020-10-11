'use strict';
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
//var file = require('./file');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var mysql = require('mysql');

//连接数据库
function getConnectionDB() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'czh',
        password: 'qwerty1001',
        database: '3DEditor'
    });
    connection.connect(function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("连接数据库成功！");
    });
    return connection;
}
function closeConnectionDB(connection) {
    connection.end();
}
module.exports = {
    getConnectionDB,
    closeConnectionDB
}
//登录检查
/*router.post('/loginIn', urlencodedParser, function (req, res) {
    var user_id = req.param("user_id");
    var user_pwd = req.param("user_pwd");
    console.log("输出user：" + user_id + "," + user_pwd);
    getConnectionDB();
    connection.query('SELECT COUNT(*) FROM USER WHERE ID=? AND PWD = ?', [user_id, user_pwd],
        function (err, result) {
            if (err) {
                throw err;
            }
            result.forEach(function (row) {
                console.log("COUNT:" + row["COUNT(*)"]);
                if (result.length == 1 && row["COUNT(*)"] == 1) {
                    //设置cookies 
                    res.cookie("userid", user_id, { maxAge: 60 * 6000 });
                    res.cookie("username", user_id, { maxAge: 60 * 6000 });
                    console.log("进入测试" + result);
                    //res.render('index.ejs', { meshes: [{ name:"text"}], userid: user_id });
                    var userScence = file.openUserScenceFile();
                    var sendmeshes = [];
                    userScence.forEach(function (mesh) {
                        let tmp = { name: mesh };
                        sendmeshes.append(tmp);
                    });
                    var sendpictures = [];
                    var userPicture = file.openUserTextureFile();
                    userPicture.forEach(function (picture) {
                        let tmp = { name: picture };
                        sendpictures.append(tmp);
                    });
                    res.render('index.ejs', { userid: user_id, meshes: sendmeshes, pictures: sendpictures });
                }
                else {
                    console.log(result);
                    res.clearCookie("userid");
                    res.clearCookie('uername');
                    res.sendfile('./public/pages/login.html');
                }
            });        
        });
        closeConnectionDB();
});*/
//注册功能检查
/*router.post('/registerIn', urlencodedParser, function (req, res) {
    //var param = req.params || req.query;
    var user_id = req.param("user_id");
    var user_pwd = req.param("first_pwd");
    console.log(user_id);
    getConnectionDB();
    connection.query('INSERT INTO USER VALUE(?,?)', [  user_id, user_pwd, ], function (err, result) {
        if (err) {
            return console.error(err);
        }
        console.log("注册成功！");
        //设置cookies
        //file.createUserFolder(user_id);
        //router.post('./public/pages/login.html');
        res.sendfile('./public/pages/login.html');
        //req.post('./public/pages/login.html');
    });
    closeConnectionDB();
});*/
//判断注册的userId是否能够注册
/*router.get("/isUserId", urlencodedParser, function (req, res) {

    //var user_id = req.data.userid;
    var user_id = req.data;
    console.log("检查账号" + user_id + "是否存在！");
    getConnectionDB();
    connection.query("SELECT COUNT(*) FROM USER WHERE ID = ?", [user_id], function (err, data) {
        if (err) throw err;
        data.forEach(function (row) {
            if (data.length == 1 && row["count(*)"] == 1) {
                res.send('false');
            }
            else {
                res.send('true');
            }
        });
    });
    closeConnectionDB();

});
module.exports = router;*/