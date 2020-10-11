//保存网格组
var objectUrl = "c:/";
//保存上传要加载的文件名
var load_file_path = [];
//导出obj格式的模型
function exportObjSceneFile(){
	//var meshes = scene.meshes;
    var meshes = all_meshes;
	var project_name = $.cookie("projectname");
	var obj_str = BABYLON.OBJExport.OBJ(meshes,false,project_name +'.mtl');
	var mtl_str="";
	for(var i = 0 ;i<meshes.length;i++){
		if(meshes[i].material==null){
			continue;
		}
	 	mtl_str = mtl_str + BABYLON.OBJExport.MTL(meshes[i]);
	}
    var obj_filename = project_name + ".obj";
    var mtl_filename = project_name + ".mtl";

    var obj_blob = new Blob ( [ obj_str ], { type : "octet/stream" } );
    var mtl_blob = new Blob([mtl_str],{type:"octet/stream"});

    // turn blob into an object URL; saved as a member, so can be cleaned out later
    $.ajax({
        data:"",
        method:"GET",
        url:"http://127.0.0.1:8080/getMapFiles",
        success: function (data) {
          
            console.log(data);
        },
        error: function (err) {
            console.log("error" + err);
        }
    });
    var obj_url = (window.webkitURL || window.URL).createObjectURL(obj_blob);
    var mtl_url = (window.webkitURL || window.URL).createObjectURL(mtl_blob);
    var obj_link = window.document.createElement('a');
    obj_link.href = obj_url;
    obj_link.download = obj_filename;
    var obj_click = document.createEvent("MouseEvents");
    obj_click.initEvent("click", true, false);
    obj_link.dispatchEvent(obj_click);
    var mtl_link = window.document.createElement('a');
    mtl_link.href = mtl_url;
    mtl_link.download = mtl_filename;
    var mtl_click = document.createEvent("MouseEvents");
    mtl_click.initEvent("click", true, false);
    mtl_link.dispatchEvent(mtl_click);
    
}
//导出stl格式的模型
function exportStlSceneFile(){
	//var meshes = scene.meshes;
    var meshes = all_meshes;
	var file_name = $.cookie("projectname");
	var str = BABYLON.STLExport.CreateSTL(meshes,false,file_name+".STL");
	var project_name = $.cookie("projectname");
	var stl_filename = project_name + ".STL";
	var blob = new Blob ( [ str ], { type : "octet/stream" } );
	var stl_url = (window.webkitURL || window.URL).createObjectURL(blob);
	var stl_link = window.document.createElement('a');
    stl_link.href = stl_url;
    stl_link.download = stl_filename;
    var stl_click = document.createEvent("MouseEvents");
    stl_click.initEvent("click", true, false);
    stl_link.dispatchEvent(stl_click);
}
//保存场景.babylon
function saveSceneFile() {
    var project_name = $.cookie("projectname");
    var user_id = $.cookie("userid");
    isExitSceneMeshes();//释放内存
    scene.removeMesh(ground);
    scene.removeMaterial(mat_grass);
    var serializedScene = BABYLON.SceneSerializer.Serialize(scene);
    var scene_data = JSON.stringify(serializedScene); 
    scene.addMesh(ground);
    scene.addMaterial(mat_grass);
    //console.log(scene_data);
    var data = { scenedata: scene_data, userid: user_id, projectname: project_name };
    $.ajax({
        url: 'http://127.0.0.1:8080/uploadScenceFile',
        data: data,
        method: "post",
        dataType: 'json',
        success: function (data) {
            if (data == "true") {
                console.log("保存场景成功：" + data);
            }
            $("#save_scene_dialog_success").dialog({
                resizable: false,
                height:140,
                modal: true,
                title:"保存场景",
                type:"success",
                message:"场景保存成功！",
                buttons:{
                    "确认":function(){
                        $(this).dialog("close");
                    }
                }
            });
        },
        fail: function (data) {
            $("#save_scene_dialog_fail").dialog({
                resizable: false,
                height:140,
                modal: true,
                title:"保存场景",
                type:"error",
                message:"场景保存失败！"+data,
                buttons:{
                    "确认":function(){
                        $(this).dialog("close");
                    },
                    "重新上传":function(){
                        $(this).dialog('close');
                        saveSceneFile();
                    }
                }
            });
        }
    });
}
//判断网格是否在场景中
function isExitSceneMeshes(){
    var scene_meshes = scene.meshes;
    for(var i = 0; i < all_meshes.length;i++){
        for(var j = scene_meshes.length - 1;j >= 0;j--){
            if(all_meshes[i].id == scene_meshes[j].id){
                break;
            }
            else if(j==0){   
                all_meshes[i].dispose();
            }
        }
    }
    //初始化
    back_history = [];
    $("#go_back_history").css("color","#C4C4C4");
    undo_history = [];
    $("#cancel_history").css("color","#C4C4C4");
}
//保存场景
function doDownloadMesh(filename, mesh) {
    //mesh = scene.meshes;
    mesh = select_mesh;
    if (mesh == null) {
        return;
    }
    filename = select_mesh.id;
    if(objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
    }
    var serialized_mesh = BABYLON.SceneSerializer.SerializeMesh(mesh);

    var strMesh = JSON.stringify(serialized_mesh);

    if (filename.toLowerCase().lastIndexOf(".babylon") !== filename.length - 8 || filename.length < 9){
        filename += ".babylon";
    }

    var blob = new Blob ( [ strMesh ], { type : "octet/stream" } );

    // turn blob into an object URL; saved as a member, so can be cleaned out later
    objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);

    var link = window.document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    var click = document.createEvent("MouseEvents");
    click.initEvent("click", true, false);
    link.dispatchEvent(click);       
}
//下载到场景
function doDownloadScene() {
    var userid = document.cookie.split(";")[0].split("=")[1];
    var file_name = $.cookie("projectname");
    console.log("userid" + userid);
    if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
    }
    var serializedScene = BABYLON.SceneSerializer.Serialize(scene);

    var strScene = JSON.stringify(serializedScene);

    if (file_name.toLowerCase().lastIndexOf(".babylon") !== file_name.length - 8 || file_name.length < 9) {
        file_name += ".babylon";
    }
    var blob = new Blob([strMesh], { type: "octet/stream" });

    // turn blob into an object URL; saved as a member, so can be cleaned out later
    objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);

    var link = window.document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    var click = document.createEvent("MouseEvents");
    click.initEvent("click", true, false);
    link.dispatchEvent(click);
}
//截图功能
function Screenshot() {
    var can_width = canvas.width;
    var can_height = canvas.height;
    console.log(can_height);
    var img = BABYLON.Tools.CreateScreenshot(engine, camera, { width: can_width, height: can_height });
}
function getCookie() {
    console.log(document.cookie);
    var user_id = document.cookie.split(";")[0].split("=")[1];
    console.log(user_id);
    return user_id;
}
//获得文件后缀名
function getFileType(file) {
    var file_name = file;
    var file_index_first = file_name.lastIndexOf('.');
    var file_index_second = file_name.length;
    var file_type = file_name.substring(file_index_first, file_index_second).toUpperCase();
    return file_type;
}
//打开obj(mtl)或stl文件
function OpenObjAndStlFile() {
    console.log("进入");
    var file_obj = document.createElement('input');
    file_obj.setAttribute("id", 'menu_obj_stl_file_upload');
    file_obj.setAttribute("type", "file");
    file_obj.setAttribute("style", 'visibility:hidden');
    file_obj.setAttribute("multiple","multiple");
    document.body.appendChild(file_obj);
    file_obj.click();
    file_obj.setAttribute("onchange", "uploadUserObjAndSTLTimeFile()");
}
//上传用户上传的babylonjs或obj或stl文件到暂时文件夹下
function uploadUserObjAndSTLTimeFile() {
    //var file = $("#menu_obj_stl_file_upload").get(0).files[0];
    var files = $("#menu_obj_stl_file_upload").get(0).files;
    if (files.length == 0)
        return;
    for(var i = 0; i <files.length;i++){
        var file = files[i];
        let file_type = getFileType(file.name);
        if (file_type != ".OBJ" && file_type != '.STL' && file_type != '.MTL') {
            console.log("文件名称错误："+file_type);
            return;
        }
        if(file.size >= 1024 * 1024 * 40){
            console.log("文件超过40M");
            return;
        }
    }
    console.log("上传模型");
    let url = 'http://127.0.0.1:8080/uploadUserTimeFile';
    let data = new FormData();
    for(var i = 0; i <files.length;i++){
        var file = files[i];
        data.append("file", file);
    }
    console.log(data);
    $.ajax({
        url: url,
        data: data,
        type: 'post',
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data.filepath + "," + data.filename);
            loadImportMeshFile(data.filepath, data.filename);
        },
        error: function (err) {
            console.log("error" + err);
        }
    });
    
    /*let file_type = getFileType(file.name);
    if (file_type == ".OBJ" || file_type == '.STL') {
        
    }*/
    $(this).remove();
}
//打开babylon文件选择框
function OpenBabylonFile() {
    var file_obj = document.createElement('input');
    file_obj.setAttribute("id", 'menu_babylon_file_upload');
    file_obj.setAttribute("type", "file");
    file_obj.setAttribute("style", 'visibility:hidden');
    document.body.appendChild(file_obj);
    file_obj.click();
    file_obj.setAttribute("onchange", "uploadUserBabylonTimeFile()");
}
//上传用户上传的babylonjs文件到暂时文件夹下
function uploadUserBabylonTimeFile() {
    let file = $("#menu_babylon_file_upload").get(0).files[0];
    if (file == null)
        return;
    let file_type = getFileType(file.name);
    if(file_type==".BABYLON"){
        if (file.size <= 1024 * 1024 * 40) {
            let url = 'http://127.0.0.1:8080/uploadUserTimeFile';
            let data = new FormData();
            data.append("file", file);
            $.ajax({
                url: url,
                data: data,
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log(data.filepath + "," + data.filename);
                    loadImportMeshFile(data.filepath, data.filename);
                },
                error: function (err) {
                    console.log("error" + err);
                }

            });
        } else {
            console.log("数据错过40MB");
        }
    }
    $(this).remove();
}
//发送数据
function sendClientData(url, user_id, file_name, file_data) { 
    var _file_data = JSON.stringify(file_data);
    var _data = { userid: user_id, filename: file_name, filedata: _file_data };
    let file_path = '../users/' + user_id + "/timeFile/" + file_name;
    //console.log(_data);
    $.ajax({
        data: _data,
        url: url,
        type: "post",
        dataType: 'JSON',
        success: function (data) {
            console.log("upload file success!");
        },
        error: function (err) {
            console.log('error' + err);
        }
    }); 
}

function uploadComplete(evt) {
    var data = JSON.parse(evt.target.responseText);
    if (data.success) {
        window.alter("上传成功");
    } else {
        window.alter("上传失败");
    }
}
function Upload()
{
	var file_obj = document.getElementById('menu_babylon_file_upload').files[0];
	if(typeof(file_obj) == 'undefined' || file_obj.size <= 0){
		return;
	}
	var file = $("#menu_babylon_file_upload").val();
	var ex = file.substring(file.indexOf("."),file.length).toUpperCase();
	var formFile = new FormData();
    console.log(ex);
	if (ex== ".JPG" || ex== ".PNG"||ex == ".GIF" || ex == ".babylon" || ex == ".BABYLON") {
            var formFile = new FormData();
            formFile.append("action", "UploadVMKImagePath");
            formFile.append("file", file_obj); //加入文件对象
            var data = formFile;
            $.ajax({
                url: "127.0.0.1:8080/uploadBabylonFile",
                data: data,
                type: "Post",
                dataType: "json",
                cache: false,//上传文件无需缓存
                processData: false,//用于对data参数进行序列化处理 这里必须false
                contentType: false, //必须
                success: function (result) {
                    if (result.return) {
                        //alert("上传成功");
                        console.log("");
                    } else {
                        //alert(result.Message);
                        console.log(result.Message);
                    }
                }, error: function (ex) {
                    console.warn(ex);
                }
            })
        } else {
            console.log("格式不符合");        
        }
}