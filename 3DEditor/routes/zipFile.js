var path = require("path");
var jsZip = require("jszip");
var fs = require('fs');
let zip = new jsZip();
//读取目录
function readDir(obj, now_path) {
    let files = fs.readdirSync(now_path);//读取目录中的所有文件及文件夹（同步操作）
    files.forEach(function (file_name, index) {//遍历检测目录中的文件
        console.log(file_name, index);//打印当前读取的文件名
        let fill_path = now_path + "/" + file_name;
        let file = fs.statSync(fill_path);//获取一个文件的属性
        if (file.isDirectory()) {//如果是目录的话，继续查询
            let dir_list = zip.folder(file_name);//压缩对象中生成该目录
            readDir(dir_list, fill_path);//重新检索目录文件
        } else {
            obj.file(file_name, fs.readFileSync(fill_path),{base64: true});//压缩目录添加文件

        }
    });
}
//开始打包压缩文件
function startZIPFile(req,res){
    let user_id = req.cookies['userid'];
    let project_name = req.cookies['projectname'];
    let file_path = "./public/users/" + user_id + "/"+project_name+"/maps/";
    readDir(zip,file_path);
    zip.generateAsync({//设置压缩格式，开始打包
        type: "nodebuffer",//nodejs用
        compression: "DEFLATE",//压缩算法
        compressionOptions: {//压缩级别
            level: 9
        }
    }).then(function (content) {
        var down_path = "./public/users/" + user_id + "/timeFile/";
        fs.writeFileSync(down_path + "/maps.zip", content, "utf-8");//将打包的内容写入 当前目录下的 result.zip中
        res.download(down_path + "/maps.zip");
        //res.end(content);
    });
}
module.exports = {
    startZIPFile
};