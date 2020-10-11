flag.pickType = "mesh";
function setSelectpickType(vl){
	if(vl==0){
		flag.pickType = "mesh";
	}
	else if(vl==1){
		flag.pickType = "tryangle";
	}
	else if(vl==2){
		flag.pickType = "point";
	}
	else{
		flag.pickType = "default";
	}
	$("#select_options").html(flag.pickType);
}
function setCreateMeshKind(vl){
	$("#create_mesh_kind").html(vl);
}
function initMeshBoundingBox(){
    for(var i=0;i<all_meshes.length;i++){
        all_meshes[i].showBoundingBox = false;
    }
}
function IsAllMesh() {
    var mesh = select_mesh;
    console.log(mesh.id);
    for (var i = 0; i < all_meshes.length; i++) {
       //onsole.log(all_meshes[i].id);
        if (mesh.id == all_meshes[i].id) {
            console.log("cs");
            return true;
        }
    }
    return false;
}
function MeshRemove(mesh) {
    if (IsAllMesh(mesh)) {
        console.log("测试");
        for (var i = 0; i < all_meshes.length; i++) {
            if (all_meshes[i].id == mesh.id) {
                for (var j = i; j < all_meshes.length; j++) {
                    all_meshes[j] = all_meshes[j + 1];
                }
                all_meshes.pop();
                gizmo_manager.attachToMesh(null);
                return;
            }
        }
    }
    else {
        all_meshes.push(mesh);
        gizmo_manager.attachToMesh(mesh);
    }
}
function showAndCloseMeshDialog() {
    if ($("#system_meshes_dialog").is(":hidden")) {
        $("#system_meshes_dialog").css("display", "block");
    } else {
        $("#system_meshes_dialog").css("display", "none");
    }
}
function importMeshToScene(el) {
    var obj_name = el.id;
    //console.log(el);
    if (obj_name) {
        showAndCloseMeshDialog();
        //loadImportMeshFile('../system/scenes/', obj_name);
        loadImportObjAndStlFile('../system/scenes/', obj_name);
    }
}
//展示材质库
function displayMaterialCollection() {
    var materials = scene.materials;
    $("#materials_collection_div").empty();
    $("#textures_collection_div").empty();
    $("#material_content").css("display", "block");
    $("#texture_content").css("display", "none");
    $(".menu-material").css("background-color", "white");
    $(".menu-texture").css("background-color", "darkgray");
    var obj = document.getElementById("materials_collection_div");
    for (var i = 0; i < materials.length; i++) {
        if (materials[i].id == "mat_grass") {
            continue;
        }
        else {
            var item = createMaterialItem(materials[i]);
            //console.log(item);
            obj.appendChild(item);
        }  
    }
}
function createMaterialItem(item) {
    var obj = document.createElement("div");
    obj.id = item.id;
    obj.className = "material-collection-row";
    var title_div = document.createElement("div");
    title_div.className = "material-title";
    title_div.innerHTML = item.id;
  /*var edit = document.createElement("div");
    edit.className = "material-edit";
    edit.innerHTML = "edit";
    edit.setAttribute("onclick", "setMaterialData(this)");*/
    var del = document.createElement("div");
    del.className = "material-del";
    del.innerHTML = "删除";
    del.id = "del" + item.id;
    del.setAttribute("onclick", "delMaterial(this)");
    obj.appendChild(title_div);
    obj.appendChild(del);
    return obj;
}
//展示纹理库 
function displayTextureCollection() {
    //获取纹理
    var textures = scene.textures;
    $(".menu-material").css("background-color", "darkgray");
    $(".menu-texture").css("background-color", "white");
    $("#texture_content").css("display", "block");
    $("#material_content").css("display", "none");
    $("#materials_collection_div").empty();
    $("#textures_collection_div").empty();
    var obj = document.getElementById("textures_collection_div");
    for (var i = 0; i < textures.length; i++) {
        if (textures[i].url == "../system/textures/grass.jpg") {
            continue;
        }
        else {
            var item = createTextureItem(textures[i]);
            obj.appendChild(item);
        }  
    }
}
function createTextureItem(item) {
    var obj = document.createElement("div");
    obj.id = item.url;
    obj.className = "textures-collection-row";
    var img_div = document.createElement("div");
    img_div.className = "texture-image-div";
    var img = document.createElement("img");
    img.className = "texture-image";
    var img_name = item.url.split("/");
    //var img_url = "../users/"+user_id+"/"+project_name+"/textures/"+img_name[img_name.length-1];
    var img_url = "../users/"+user_id+"/"+project_name+"/maps/"+img_name[img_name.length-1];
    img.setAttribute("src", img_url);
    //img.setAttribute("alt"，"error");
    img_div.appendChild(img);
    var opt_div = document.createElement("div");
    opt_div.className = "texture-option-div";
    /*var edit = document.createElement("div");
    edit.className = "texture-edit";
    edit.setAttribute("onclick", "setTextureData()");
    edit.innerHTML = "edit";*/
    var del = document.createElement("div");
    del.className = "texture-edit";
    del.id = 'del'+item.url;
    del.setAttribute('onclick', 'delTexture(this)');
    del.innerHTML = "删除";
    opt_div.appendChild(del);
    obj.appendChild(img_div);
    obj.appendChild(opt_div);
    return obj;
}
$(document).on("click", function (e) {
    //纹理删除事件监听
    $("div.material-del").click(function () {
        var id = $(this).parentsUntil("div.materials_collection_div")
            .attr('id');
    });
    //材质删除事件监听
    $("div.texture-del").click(function () {
        var id = $(this).parentsUntil("div.textures_collection_div")
            .attr('id');
    });
});
$(document).ready(function () {
    var id = $(this).attr("id");
    //console.log(id);
});
//加入回退历史list
 function pushBackHistory(obj){
    back_history.push(obj);
    $("#go_back_history").css("color","#292929");
 }
//加入撤销历史list
function pushUndoHistory(obj){
    undo_history.push(obj);
    $("#cancel_history").css("color","#292929");
}
 //回退历史操作
 function popBackHistory(){
    if(back_history.length>0){
        var obj = back_history.pop();
        switch(obj[0]){
            case "addMesh"://加入网格
            deleteMesh(obj[1]);
            obj[0] = "deleteMesh";
            break;
            case "deleteMesh":
            addMesh(obj[1]);
            obj[0] = "addMesh";
            break;
            case "modifyMaterial":
            inAdjustMaterial(obj[1]);
            break;
            case "moveMesh":
            inAdjustMove(obj[1],obj[2]);
            break;
            case "scaleMesh":
            inAdjustScale(obj[1],obj[2]);
            break;
            case "rotationMesh":
            inAdjustRoa(obj[1],obj[2]);
            break;
            default:
            console.log("无此操作")
            break;
        }
        pushUndoHistory(obj);
    }
    //变成灰色
    if(back_history.length == 0){
        $("#go_back_history").css("color","#C4C4C4");
    }
    return;

 }
 //撤销历史操作
 function popUndoHistory(){
    if(undo_history.length>0){
        var obj = undo_history.pop();
        console.log(obj);
        
    switch(obj[0]){
            case "addMesh"://加入网格
            deleteMesh(obj[1]);
            obj[0]="deleteMesh";
            break;
            case "deleteMesh":
            addMesh(obj[1]);
            console.log("其他");
            obj[0] = "addMesh";
            break;
            case "modifyMaterial":
            updateMaterial(obj[1]);
            break;
            case "moveMesh":
            inAdjustMove(obj[1],obj[2]);
            break;
            case "scaleMesh":
            inAdjustScale(obj[1],obj[2]);
            break;
            case "rotationMesh":
            inAdjustRoa(obj[1],obj[2]);
            break;
            default:
            console.log("无此操作")
            break;
        }
        pushBackHistory(obj);
    }
    if(undo_history.length == 0){
        $("#cancel_history").css("color","#C4C4C4");
    }
    return ;

 }
 
 //初始化
 function init(){
    createMeshMaterialOptions();//初始化网格面版material
    //createMaterialTextureOptions();//初始化材质面板的纹理选择
 }



