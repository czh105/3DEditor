function setMeshMove() {
    if (!select_mesh) {
        return;
    }
    gizmo_manager.positionGizmoEnabled = false;
    gizmo_manager.rotationGizmoEnabled = false;
    gizmo_manager.scaleGizmoEnabled = false;
    gizmo_manager.boundingBoxGizmoEnabled = false;

    gizmo_manager.attachToMesh(select_mesh);
    gizmo_manager.positionGizmoEnabled = true;
    showAndColseRightMenu();
}
function setMeshRotate() {
    if (!select_mesh) {
        return;
    }
    gizmo_manager.positionGizmoEnabled = false;
    gizmo_manager.rotationGizmoEnabled = false;
    gizmo_manager.scaleGizmoEnabled = false;
    gizmo_manager.boundingBoxGizmoEnabled = false;

    gizmo_manager.attachToMesh(select_mesh);
    gizmo_manager.rotationGizmoEnabled = true;
    showAndColseRightMenu();
}
function setMeshScale() {
    if (!select_mesh) {
        return;
    }
    gizmo_manager.positionGizmoEnabled = false;
    gizmo_manager.rotationGizmoEnabled = false;
    gizmo_manager.scaleGizmoEnabled = false;
    gizmo_manager.boundingBoxGizmoEnabled = false;

    gizmo_manager.attachToMesh(select_mesh);
    gizmo_manager.scaleGizmoEnabled = true;
    showAndColseRightMenu();
}
function addMeshMaterial(){
    closeMaterialPanel();
    showAndColseRightMenu();
}
function addMeshTexture(){
    showAndCloseTexturePanel();
    showAndColseRightMenu();
}
function setSubtractMesh(){
    //flag.conbineType = 2;
    if (select_mesh) {
        var cur_length = all_meshes.length;
        for (let index = 0; index < cur_length; index++) {
            if (select_mesh.id != all_meshes[index].id) {
                if (select_mesh.intersectsMesh(all_meshes[index], false)) {
                    //开始融合网格
                    console.log("网格剪切:"+all_meshes[index]);
                    subtractMesh(select_mesh, all_meshes[index]);
                }

            }
        }  
    } 
    showAndColseRightMenu();
    return;
}
function setUnionMesh(){
    if (select_mesh) {
        var cur_length = all_meshes.length;
        for (let index = 0; index < cur_length; index++) {
            if (select_mesh.id != all_meshes[index].id) {
                if (select_mesh.intersectsMesh(all_meshes[index], false)) {
                    //开始融合网格
                    console.log("网格融合");
                    unionMesh(select_mesh, all_meshes[index]); 
                    //console.log(all_meshes[index]);
                }

            }
        }
    }
    showAndColseRightMenu();
}
function exitIndexPage(){
    window.history.back(-1);
}
function goBackHistoryMenu() {
    //撤销
}
function cancelHistoryMenu() {
    //取消撤销
}
function enlargeCameraRadiusMenu() {
    camera.radius -= 100;
    var camera_radius = camera.radius;  
    if (camera_radius <= 400) {
        $("#zoom_in_camera_radius").css("color", "#C4C4C4");
        return;
    }
    if (camera_radius >= 500 && camera_radius <= 1900 ) {
        $("#zoom_out_camera_radius").css("color", "#292929"); 
    }
    setCameraPosition();
    return;
}
//缩小
function narrowCameraRadiusMenu() {
    console.log("缩小");
    camera.radius = camera.radius + 100;
    var camera_radius = camera.radius;
    if (camera_radius <= 1900 && camera_radius >= 400) {
       $("#zoom_in_camera_radius").css("color", "#292929"); 
    }
    if (camera_radius <= 400) {
        $("#zoom_out_camera_radius").css("color", "#c4c4c4");
    }
    setCameraPosition();
    return;
}
function deteletMeshMenu() {
    if (select_mesh) {
        //select_mesh.dispose();
        removeMesh(select_mesh);
        select_mesh = null;
        initLeftMenu();
        var obj = ["deleteMesh",select_mesh];
        setCurrentMeshData(select_mesh);
        gizmo_manager.attachToMesh(null);

    }
}
function lockMeshMenu() {
    MeshRemove(select_mesh);  
}
/*function convertParentToChildren(){
    for(var i = 1;i<select_meshes.length;i++){
        select_meshes[i].setParent = null;
        if(gizmo_manager.positionGizmoEnabled){
            select_meshes[i]._position = select_meshes[0]._position.add(select_meshes_sub[i-1]);
        }
        else if(gizmo_manager.rotationGizmoEnabled){
            select_meshes[i]._position = select_meshes[0]._position.add(select_meshes_sub[i-1]);
            select_meshes[i].rotationQuaternion = select_meshes[0].rotationQuaternion;
        }
        else if(gizmo_manager.scaleGizmoEnabled){
            select_meshes[i]._position = select_meshes[0]._position.add(select_meshes_sub[i-1]);
            select_meshes[i]._scaling = select_meshes[0]._scaling;
        }
        else{
            select_meshes[i]._position = select_meshes[0]._position.add(select_meshes_sub[i-1]);
        }
    }
    for(var i = 1;i<select_meshes.length;i++){
        var vec_sub = select_meshes[i].position.subtract(select_meshes[0].position);
        select_meshes_sub.push(vec_sub);
        select_meshes[i].setParent(select_meshes[0]);
    }
    gizmo_manager.attachToMesh(select_meshes[0]);
}*/
