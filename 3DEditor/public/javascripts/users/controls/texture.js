function createTexture(texture_name){
    //开始获取所有的纹理信息
    let texture_level = $("#texture_level")[0].value; 
    if (!texture_level) {
        texture_level = 1;
    }
    let texture_hasAlpha = $("#texture_hasAlpha")[0].value;
    let texture_mode = $("#texture_mode")[0].value;
    let texture_uOffset = $("#texture_uOffset")[0].value;
    let texture_vOffset = $("#texture_vOffset")[0].value;
    let texture_uScale = $("#texture_uScale")[0].value;
    let texture_vScale = $("#texture_vScale")[0].value;
    let texture_uAng = $("#texture_uAng")[0].value;
    let texture_vAng = $("#texture_vAng")[0].value;
    let texture_wAng = $("#texture_wAng")[0].value;
    let texture_uWrap = $("#texture_uWrap")[0].value;
    let texture_rWrap = $("#texture_rWrap")[0].value;
    console.log(typeof texture_uWrap);
    let texture_vWrap = $("#texture_vWrap")[0].value;
    //开始创建
    let user_id = $.cookie("userid");
    let project_name = $.cookie("projectname");
    //let file_path = '../users/' + user_id + '/' + project_name + '/textures/';
    let file_path = '../users/' + user_id + '/' + project_name + '/maps/';
    var texture = new BABYLON.Texture(file_path + texture_name, scene);  
    texture.name = "maps/"+texture_name;
    setTextureValue(texture.level,texture_level);
    setTextureValue(texture.hasAlpha, texture_hasAlpha);
    texture.textureType = 2;
    setTextureValue(texture.uOffset, texture_uOffset);
    setTextureValue(texture.vOffset,texture_vOffset);
    setTextureValue(texture.uScale, texture_uScale);
    setTextureValue(texture.vScale, texture_vScale);
    setTextureValue(texture.uAng, texture_uAng);
    setTextureValue(texture.wAng, texture_wAng);
    setTextureValue(texture.vAng, texture_vAng);
    setTextureValue(texture.uWrap, texture_uWrap);
    setTextureValue(texture.vWrap, texture_vWrap);
    setTextureValue(texture.rWrap,texture_rWrap);
    //console.log(texture);
    $("#create_texture_success").dialog({
        resizable: false,
        height:140,
        modal: true,
        title:"创建纹理",
        type:"success",
        buttons:{
            "确认":function(){
                $(this).dialog("close");
            }
        }
    });
    showAndCloseTexturePanel();

}
function setTextureValue(texture, value) {
    if (value == null)
        return;
    if (value != "true" && value != "false") {
        value = parseFloat(value);
    }
    texture = value;
}
function uploadTexturePicture(){
    console.log("texture create");
    let file = $("#texture_name").get(0).files[0];
    if(file == null){
        return;
    }
    let file_type = getFileType(file.name);
    if (file_type == '.JPG' || file_type == ".PNG") {
        if (file.size <= 1024 * 1024 * 10) {
            let user_id = $.cookie("userid");
            let project_name = $.cookie("projectname");
            //let file_path = './public/users/' + user_id + '/' + project_name + '/textures/';
            let file_path = './public/users/' + user_id + '/' + project_name + '/maps/';
            let url = 'http://127.0.0.1:8080/uploadUserTexturePicture';
            let data = new FormData();
            data.append('img', file);
            data.append('filepath', file_path);
            $.ajax({
                url: url,
                data: data,
                type: 'post',
                processData: false,  // 告诉jQuery不要去处理发送的数据
                contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
                success: function (data) {
                    console.log("upload Texture Picture get data:" + data);
                    createTexture(data);
                },
                error: function (err) {
                    console.log('error' + err);
                }
            });
        }
    }  
}
function delTexture(ev) {
    var id = ev.id;
    var url = id.substring(3);
    console.log(url);
    var textures = scene.textures;
    for (var i = 0; i < textures.length; i++) {
        if (textures[i].url == url) {
            scene.removeTexture(textures[i]);
            $("#delete_texture_success").dialog({
                resizable: false,
                height:140,
                modal: true,
                title:"删除纹理",
                type:"success",
                buttons:{
                    "确认":function(){
                        $(this).dialog("close");
                    }
                }
            });
            displayTextureCollection();
            delUploadTexture(url);
            return;
        }
    }
    $("#delete_texture_fail").dialog({
        resizable: false,
        height:140,
        modal: true,
        title:"删除纹理",
        type:"error",
        buttons:{
            "确认":function(){
                $(this).dialog("close");
            },
            "重新删除":function(){
                $(this).dialog('close');
                delTexture(ev);
            }
        }
    });
}
function delUploadTexture(url) {
    var picture_name = url.split('/');
    picture_name = picture_name[picture_name.length-1];
    var project_name = $.cookie("projectname");
    var user_id = $.cookie("userid");
    var data = { pictureName: picture_name, userid: user_id, projectName: project_name };
    $.ajax({
        url: 'http://127.0.0.1:8080/deleteUserTextureFile',
        data: data,
        method: "post",
        success: function (data) {
            if (data == "true") {
                console.log("删除纹理图片成功："+data);
            }
            console.log(data);
        },
        fail: function (data) {

        }
    });
}