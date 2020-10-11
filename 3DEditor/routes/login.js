'use strict';
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./connectDb');
var fs = require("fs");
var file = require('./file');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
/* GET users listing. */
router.get('/', urlencodedParser, function (req, res) {
    var user_id = req.cookies.userid;
    res.sendfile('./public/pages/login.html');
    //res.sendfile('./public/pages/home.html');
});
router.post('/loginIn', urlencodedParser, function (req, res) {
    var user_id = req.param("user_id");
    var user_pwd = req.param("user_pwd");
    console.log("输出user：" + user_id + "," + user_pwd);
    var connection = db.getConnectionDB();
    connection.query('SELECT COUNT(*) FROM USER WHERE ID=? AND PWD = ?', [user_id, user_pwd],
        function (err, result) {
            if (err) {
                throw err;
            }
            result.forEach(function (row) { 
                if (result.length == 1 && row["COUNT(*)"] == 1) {
                    //设置cookies 
                    res.cookie("userid", user_id, { maxAge: 60 * 6000 });
                    //res.cookie("username", user_id, { maxAge: 60 * 6000 });
                    //读取所有的场景文件
                    file.openUserScenceFile(req, res, user_id);
                    //var file_directory = './public/users/';
                    //var pictures_path = file_directory + user_id + "/textures/";
                    //fs.readdir(pictures_path, function (err, files) {
                    //    if (err)
                    //        throw err;
                    //    var send_pictures = [];
                    //    let cur_picture_path = '../users/' + user_id +'/textures/';
                    //    files.forEach(function (texture) {
                    //        let tmp = { name: texture, path: cur_picture_path + texture };
                    //        send_pictures.push(tmp);
                    //    });
                    //    fs.readdir(file_directory + user_id + "/scences/", function (err, files) {
                    //        if (err)
                    //            throw err;
                    //        var send_meshes = [];
                    //        files.forEach(function (mesh) {
                    //            let tmp = { name: mesh };
                    //            send_meshes.push(tmp);
                    //        });   
                    //        res.render('index.html', { userid: user_id, meshes: send_meshes, pictures: send_pictures });
                    //    });   
                    //});                 
                }
                else {
                    console.log(result);
                    res.clearCookie("userid");
                    res.clearCookie('uername');
                    res.sendfile('./public/pages/login.html');
                }
            });
        });
    db.closeConnectionDB(connection);
});

router.post('/registerIn', urlencodedParser, function (req, res) {
    //var param = req.params || req.query;
    var user_id = req.param("user_id");
    var user_pwd = req.param("first_pwd");
    console.log(user_id);
    var connection = db.getConnectionDB();
    connection.query('INSERT INTO USER VALUE(?,?)', [  user_id, user_pwd, ], function (err, result) {
        if (err) {
            return console.error(err);
        }
        console.log("注册成功！");
        //设置cookies
        file.createUserFolder(res, user_id);
    });
    db.closeConnectionDB(connection);
});
//判断注册的userId是否能够注册
router.post("/isUserId", urlencodedParser, function (req, res) {
    //var user_id = req.data.userid;
    var user_id = req.body["userid"];
    console.log("检查账号" + user_id + "是否存在！");
    var connection = db.getConnectionDB();
    connection.query("SELECT COUNT(*) FROM USER WHERE ID = ?", [user_id], function (err, data) {
        if (err) throw err;      
        data.forEach(function (row) {
            console.log("该账户个数" + row['COUNT(*)']);
            if (data.length == 1 && row["COUNT(*)"] == 1) {
                res.send('false');
            }
            else {
                res.send('true');
            }
        });
    });
    db.closeConnectionDB(connection);

});
module.exports = router;