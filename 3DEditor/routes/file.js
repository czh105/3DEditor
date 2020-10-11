var fs = require('fs');
var file_directory = './public/users/';
var express = require('express');
var multiparty = require("multiparty");
var router = express.Router();
//得到上传文件种类
function getFileType(file) {
    var file_name = file;
    var file_index_first = file_name.lastIndexOf('.');
    var file_index_second = file_name.length;
    var file_type = file_name.substring(file_index_first, file_index_second).toUpperCase();
    return file_type;
}
//创建用户文件
function createUserFolder(res, user_id) {
    let path = file_directory + user_id;
    if (!fs.existsSync(path)) {
        fs.mkdir(path, function (err) {
            if (err) {
                return console.error(err);
            }
            createUserTimeFolder(res, user_id);
        });
    }
}
//创建用户的暂时文件夹
function createUserTimeFolder(res, user_id) {
    console.log("进入用户暂时文件夹创建功能");
    let path = file_directory + user_id + '/timeFile/';
    if (!fs.existsSync(path)) {
        fs.mkdir(path, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("创建scences文件夹");
            res.render('login.html');
        });
    }
}
//打开用户的场景库
function openUserScenceFile(req, res) {
    console.log("filejs openUserScenceFile()");
    let user_id = req.param("user_id")
    let path = file_directory + user_id + '/';
    if (fs.existsSync(path)) {
        fs.readdir(path, function (err, files) {
            if (err)
                throw err;
            var send_meshes = [];
            files.forEach(function (mesh) {
                if (mesh != "timeFile") {
                    let tmp = { name: mesh };
                    send_meshes.push(tmp);
                }
            });
            res.render('index.html', { userid: user_id, meshes: send_meshes });
        });
    }
}
//将模型数据上传到暂时文件夹
function uploadFileToTimeFile(req, res) {
    let user_id = req.cookies['userid'];
    let project_name = req.cookies['projectname'];
    let file_path = "./public/users/" + user_id + "/"+project_name+"/";
    let file_path_client = "../users/" + user_id + "/"+project_name+"/";
    let file_name = null;
    let form = new multiparty.Form({ uploadDir: file_path});
    form.on('error', function(err) {
      console.log('Error parsing form: ' + err.stack);
    });
    var count = 0;
    // Parts are emitted when parsing the form
    form.on('part', function(part) {
      // You *must* act on the part by reading it
      // NOTE: if you want to ignore it, just call "part.resume()"
        
        if (!part.filename) {
        // filename is not defined when this is a field and not a file
            console.log('got field named ' + part.name);
            // ignore field's content
            part.resume();
        }
     
        if (part.filename) {
            // filename is defined when this is a file
        count++;
        console.log('got file named ' + part.name);
            // ignore file's content here
        part.resume();
    }
     
    part.on('error', function(err) {
        // decide what to do
    });
    });
     
    // Close emitted after form parsed
    form.on('close', function() {
      console.log('Upload completed!');
    });
    form.parse(req, function (err, fields, files) {
        if (err)
            return console.error(err);
        for(var i = 0;i<files.file.length;i++)
        {
            let file = files.file[i];
            let upload_path = file.path;
            let file_type = getFileType(file.originalFilename);
            let dest_path = "";
            if(file_type == ".JPG" || file_type == ".PNG"){
                dest_path = file_path + "/maps/" + file.originalFilename;
            }
            else{
                
                dest_path = file_path + file.originalFilename;
            }
            fs.rename(upload_path, dest_path, function (err) {
                if (err)
                    return console.log("错误："+err);
               
            });
            if(file_type == ".OBJ" || file_type == ".STL"){
                file_name = file.originalFilename;
            }
        }
        //res.json({ filepath: file_path_client, filename: files.file[i].originalFilename });
        res.json({ filepath: file_path_client, filename: file_name });
    });

}
//将纹理图片上传到文件夹
function uploadTexturePicture(req, res) {//先上传到临时在移动到目标文件夹下
    //console.log("files:"+res.files);  
    let user_id = req.cookies['userid'];
    let file_path = './public/users/' + user_id + "/timeFile/";
    let file_path_client = '../users/' + user_id + "/timeFile/";
    let form = new multiparty.Form({ uploadDir: file_path});
    form.parse(req, function (err, fields, file) {
        var upload_file = file.img[0];
        var upload_path = upload_file.path;
        var dest_path = fields.filepath[0] + upload_file.originalFilename;
        fs.rename(upload_path, dest_path, function (err) {
            if (err) {
                console.error(err);
            }
        });
        upload_file.path = dest_path;
        res.send(upload_file.originalFilename);//发送到路径  
    });
    
}
//删除用户的纹理图片
function deleteUserTextureFile(req, res) {
    let picture_name = req.body.pictureName;
    let user_id = req.body.userid;
    let project_name = req.body.projectName;
    //let path = './public/users/' + user_id + '/' + project_name + '/textures/' + picture_name;
    let path = './public/users/' + user_id + '/' + project_name + '/maps/' + picture_name;
    console.log(path);
    if (fs.existsSync(path)) {
        fs.unlink(path, function (err) {
            console.log(path);
            if (err) {
                res.send('false');
                return console.error(err);
            }
            res.send("true"); 
        });
    }
    
}

function writeUserScenceFile(req,res){
    console.log("进入保存文件函数");
    var user_id = req.body.userid;
    var project_name = req.body.projectname;
    var scence_data = req.body.scenedata; 
    //var path = file_directory + user_id + "/" + project_name + "/scenes/" + project_name + ".babylon";
    var path = file_directory + user_id + "/" + project_name + "/" + project_name + ".babylon";
   console.log("file_path:"+path);
    fs.writeFile(path, scence_data, { 'flag': 'w' }, function (err,data) {
            if (err){
                console.log("保存错误");
                throw err;     
            }
            console.log("写入成功");
            res.send("true");
    });
}
//创建用户场景文件夹
/*function createUserSceneFolder(res, req) {
    console.log("进入用户场景创建功能");
    let user_id = req.body.userid;
    let scence_name = req.body.scenename;
    console.log(scence_name);
    let last_path = file_directory + user_id + '/' + scence_name;
    let path = last_path + '/maps/';
    if (!fs.existsSync(path)) {
        fs.mkdir(path, function (err) {
            if (err) {
                fs.rmdir(last_path, function (err) {
                    return console.error(err);
                });
                return console.error(err);
            }
            //createUserTextureFolder(res, user_id, scence_name);
        });
    }
}*/
function createUserTextureFolder(req,res){
    let user_id = req.body.userid;
    let scence_name = req.body.scenename;
    console.log(scence_name);
    let last_path = file_directory + user_id + '/' + scence_name;
    let path = last_path + '/maps/';
    if (!fs.existsSync(path)) {
        fs.mkdir(path, function (err) {
            if (err) {
                fs.rmdir(last_path, function (err) {
                    return console.error(err);
                });
                return console.error(err);
            } 
        });
    }
}
//创建用户纹理文件夹
/*function createUserTextureFolder(res, user_id, scence_name) {
    console.log("进入用户纹理创建功能");
    let last_path = file_directory + user_id + '/' + scence_name;
    let path = last_path + '/textures/';
    if (!fs.existsSync(path)) {
        fs.mkdir(path, function (err) {
            if (err) {
                //fs.rmdir(last_path, function (err) {
                    //return console.error(err);
                //});
                return console.error(err);
            }
            //res.send("true");
        });
    }
}*/
//创建场景文件夹
function createProjectFolder(req, res) {
    console.log("createSceneFolder()");
    res.send("true");
    let user_id = req.body.userid;
    let scence_name = req.body.scenename;
    let path = file_directory + user_id + '/' + scence_name + '/';
    if (!fs.existsSync(path)) {
        fs.mkdir(path, function (err) {
            if (err) {
                //res.send("false");
                return console.error(err);
            }
            //createUserSceneFolder(res, req);
            createUserTextureFolder(req,res);
        });
    }
}
//注销用户所用文件夹
function deleteUserFolder(res,userid) {
    fs.rmdir(file_directory + user_id, function (err) {
        if (err)
            return console.error(err);
        res.send("true");//注销用户成功
    });
}
//保存用户的场景文件
function saveUserScenceFile(req,res) {
    var user_id = req.body.userid;
    var scene_data = req.body.sceneData;
    
    var file_name = req.body.projectName + '.babylon';
    //let path = './public/uers/' + req.body.projectName + '/scenes/' + file_name;
    let path = './public/uers/'+ user_id + '/' + req.body.projectName + '/'+file_name;
    if(fs.existsSync(path)){
        fs.writeFile(path, scene_data, function (err) {
            if (err)
                res.send("false");
            else
                res.send('true');
        });
    }
}
function openUserTextureFile(user_id, callback) {
    let path = file_directory + user_id + "/textures/";
    fs.readdir(path, function (err, files) {
        if (err) throw err;
        callback(files);
    });
};
//删除用户的场景文件
function deleteUserScenceFile(res, user_id, scence_name) {
    console.log("进入场景file");
    let path = './public/users/' + user_id + '/' + scence_name;
    console.log("删除文件的path："+path); 
    deleteFileOrFolder(path);
    res.send('true');
}
//注销账号清空文件
function deleteFileOrFolder(file_path,callback) {
    //先判断当前filePath的类型(文件还是文件夹, 如果是文件直接删除, 如果是文件夹, 去取当前文件夹下的内容, 
    //拿到每一个递归)
    let files = [];
    console.log("进入删除模式！");
    if (fs.existsSync(file_path)) {
        files = fs.readdirSync(file_path);
        files.forEach((file, index) => {
            let cur_path = file_path + "/" + file;
            if (fs.statSync(cur_path).isDirectory()) {
                deleteFileOrFolder(cur_path); //递归删除文件夹
            } else {
                fs.unlinkSync(cur_path); //删除文件
            }
        });
        fs.rmdirSync(file_path);
    }
}

//打开系统场景文件夹
function OpenSystemScencesFolder(res, file_name) {
    let path = "./public/system/scences/" + file_name;
    if (fs.existsSync(path)) {
        fs.readdir(path, function (err, files) {
            if (err) {
                res.send("false");
                throw err;
            }
            files.forEach(function (file) {
                //console.log(file);
                //输出所选中的图形库
            });
        });
    }
}
//创建用户文件夹
module.exports = {
    createUserFolder,
    createProjectFolder,
    uploadFileToTimeFile,
    uploadTexturePicture,
    writeUserScenceFile,
    deleteUserFolder,
    saveUserScenceFile,
    //saveUserTextureFile,
    openUserScenceFile,
    openUserTextureFile,
    deleteUserScenceFile,
    deleteUserTextureFile
};


