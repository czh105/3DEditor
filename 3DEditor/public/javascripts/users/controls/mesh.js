//合并网格(捆绑)
function mergeSelectMeshes(meshes){
    var merge_mesh = new BABYLON.Mesh.MergeMeshes(meshes,true,true,allbase_mesh,true,true);
    return merge_mesh;
}
//判断是否在多选网格数组中
function meshIsSelectMeshes(mesh){
    for(var i=0;i<select_meshes.length;i++){
        if(select_meshes[i].id == mesh.id){
            return;
        }
    }
    select_meshes.push(mesh);
}
//判断该该选择框内的网格
function selectMeshReact(cur_pos){
    
    var scaling = 0.05;
    scaling = scaling.toFixed(8);
    var scale_x = getMinAndMax(cur_pos.x,down_position.x);
    var scale_y = getMinAndMax(cur_pos.y,down_position.y);
    var scale_z = getMinAndMax(cur_pos.z,down_position.z);
    
    //console.log("x type:" + typeof(x))
    var length = 1.7976931348623157e+308;
    var count = 0;
    var x = scale_x[0];
    while(x<scale_x[1]){
        var y = scale_y[0];
        while(y<scale_y[1]){
            var z = scale_z[0];
            while(z<scale_z[1]){
                var origin = new BABYLON.Vector3(x,y,z);   
                //该点投影到投影面的点坐标
                var ray = new BABYLON.Ray.CreateNewFromTo(camera.position,origin);
                var direct = scene.pickWithRay(ray).ray.direction;
                var cur_ray = new BABYLON.Ray(origin,direct);
                var mesh = scene.pickWithRay(cur_ray).pickedMesh;
                if(mesh && mesh !== ground){
                    meshIsSelectMeshes(mesh);
                }
                count += 1;
                z = parseFloat(z) + parseFloat(scaling);
                //console.log("z:"+z+","+"scale_z:"+scale_z[1]);
            }
            y = parseFloat(y) + parseFloat(scaling);
        }
        x = parseFloat(x) + parseFloat(scaling);
    }
    //console.log("count:"+count);
    return;
}
function getMinAndMax(num1,num2){
    var min = Math.min(num1,num2);
    var max = Math.max(num1,num2);
    return [min,max];
}
function pickToPoint(pick_result) {
    if (select_mesh) {
        var ray = new BABYLON.Ray(new BABYLON.Vector3(select_mesh.position.x, ground.getBoundingInfo().boundingBox.maximumWorld.y + 1, select_mesh.z),
            pick_result.ray.direction);
        //var world
    }
}
function getDateToName() {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let millis_econd = date.getMilliseconds();
    return "_" + hour  + minute  + second  + millis_econd;

}
function subtractMesh(pick_mesh, col_mesh) {
    //console.log("削切网格");
    var pick_csg = new BABYLON.CSG.FromMesh(pick_mesh);
    var col_csg = new BABYLON.CSG.FromMesh(col_mesh);
    var result_csg = col_csg.subtract(pick_csg);
    var result_mesh = result_csg.toMesh(col_mesh.id, col_mesh.material, scene);
    all_meshes.push(result_mesh);
    //scene.removeMesh(col_mesh);
    pick_csg = null;
    col_csg = null;
    result_csg = null;
    col_mesh.dispose();
    
    return;
}
function unionMesh(pick_mesh, col_mesh) {
    console.log("融合网格");
    var pick_csg = new BABYLON.CSG.FromMesh(pick_mesh);
    var col_csg = new BABYLON.CSG.FromMesh(col_mesh);
    var result_csg = col_csg.union(pick_csg);
    var result_mesh = result_csg.toMesh(col_mesh.id, col_mesh.material, scene);
    //删除其他的
    all_meshes.push(result_mesh);
    pick_csg = null;
    col_csg = null;
    result_csg = null;
    pick_mesh.dispose();
    col_mesh.dispose();
    return;
}
function deleteAllMeshList(mesh) {
    for (var i = 0; i < all_meshes.length; i++) {
        if (all_meshes[i].id == mesh.id) {
            for (var j = i; j < all_meshes.length; j++) {
                all_meshes[j] = all_meshes[j + 1];
            }
            all_meshes[j] = null;
            break;
        }
    }
}
//改变当前mesh是否启用
function changeMeshIsEnabled(vl){
    var mesh = select_mesh;
	mesh.isEnabled(vl);
}
//改变当前mesh的可见性
function changeMeshIsVisible(vl){
    var mesh = select_mesh;
    mesh.isVisible = vl;
    console.log(mesh.isVisible);
}
//mesh的material值改变修改
function changeMeshMaterial(vl){
    var mesh = select_mesh;
    if(vl == 'none'){
        mesh.material = null;
    }
	var materials = scene.materials;
	for(var i = 0;i < materials.length;i++){
		if(materials[i].id == vl){
            //console.log(select_mesh);
			mesh.material = materials[i];
            createMeshmaterialItem(select_mesh.id,mesh.material);
            break;
		}
	}
   
    if(mesh.material == null){
        disabledCurrentMaterialColorPanel();
    }else{
        removeDisabledMaterialColorPanel();
    }

    return;
}
//修改当前mesh的material的颜色
//rgb->16进制
function RGBConvertHexadecimal(rgb) {
    let hexcode = "#";
    var v = rgb.substring(4, rgb.length - 1);
    var s = v.split(",");
    for (var i = 0; i < 3; i++) {
        var tmp = s[i];
        if (tmp === "") n = "0";
        var c = "0123456789ABCDEF";
        let b = "";
        let a = tmp % 16;
        b = c.substr(a, 1);
        a = (tmp - a) / 16;
        hexcode += c.substr(a, 1) + b;
    }
    return hexcode;
}
//1、Diffuse color
function changeMeshMaterialDiffuseColor(rgb_str) {
    //select_mesh = 
    let hexcode = RGBConvertHexadecimal(rgb_str);
    let diffuse_color = new BABYLON.Color3.FromHexString(hexcode);
    //console.log(diffuse_color);
    select_mesh.material.diffuseColor = diffuse_color;
    createMeshmaterialItem(select_mesh.id,select_mesh.material);
}
//2、specular color
function changeMeshMaterialSpecularColor(rgb_str) {
    let hexcode = RGBConvertHexadecimal(rgb_str);
    let specular_color = new BABYLON.Color3.FromHexString(hexcode);
    select_mesh.material.specularColor = specular_color;
    createMeshmaterialItem(select_mesh.id,select_mesh.material);
}
//3、ambient color
function changeMeshMaterialAmbientColor(rgb_str) {
    let hexcode = RGBConvertHexadecimal(rgb_str);
    let ambient_color = new BABYLON.Color3.FromHexString(hexcode);
    select_mesh.material.ambientColor = ambient_color;
    createMeshmaterialItem(select_mesh.id,select_mesh.material);
}
//4、emissive color
function changeMeshMaterialEmissiveColor(rgb_str) {
    let hexcode = RGBConvertHexadecimal(rgb_str);
    let emissive_color = new BABYLON.Color3.FromHexString(hexcode);
    select_mesh.material.emissiveColor = emissive_color;
    createMeshmaterialItem(select_mesh.id,select_mesh.material);
}
//改变父类
function changeMeshParent(vl){
    var mesh = select_mesh;
	var meshes = scene.meshes;
	if(vl == "none"){
		return;
	}
	for(var i = 0 ;i < meshes.length;i++){
		if(meshes[i].id == vl){
			mesh.parent = meshes[i];
		}
	}
}

function changeMeshPickable(vl){
    var mesh = select_mesh;
	mesh.isPickable = vl;
}
//移除所有选项
function removeAllChild(el){
	while(el.hasChildNodes()){
		el.removeChild(el.firstChild);
	}
	return el;
}
//修改mesh的position
function updateMeshPositionX(vl){
    var mesh = select_mesh;
	mesh.position.x = parseFloat(vl);
    createMeshObjItem(0,mesh.id,mesh.position);
}
function updateMeshPositionY(vl){
    var mesh = select_mesh;
	mesh.position.y = parseFloat(vl);
    createMeshObjItem(0,mesh.id,mesh.position);
}
function updateMeshPositionZ(vl){
    var mesh = select_mesh;
	mesh.position.z = parseFloat(vl);
    createMeshObjItem(0,mesh.id,mesh.position);
}
//修改mesh旋转
function updateMeshRotationX(vl){
    var mesh = select_mesh;
	var x = parseFloat(vl);
    var y = mesh.rotation.y;
    var z = mesh.rotation.z;
    mesh.rotation = new BABYLON.Vector3(x,y,z);
    //console.log("x:"+mesh.rotation.x);
    //scene.render();
    createMeshObjItem(1,mesh.id,mesh.rotation);
}
function updateMeshRotationY(vl){
    var mesh = select_mesh;
	//mesh.rotation.y = parseFloat(vl);
    var x = mesh.rotation.x;
    var y = parseFloat(vl);
    var z = mesh.rotation.z;
    mesh.rotation = new BABYLON.Vector3(x,y,z);
    createMeshObjItem(1,mesh.id,mesh.rotation);
}
function updateMeshRotationZ(vl){
    var mesh = select_mesh;
	//mesh.rotation.z = parseFloat(vl);
    var x = mesh.rotation.x;
    var y = mesh.rotation.y;
    var z = parseFloat(vl);
    mesh.rotation = new BABYLON.Vector3(x,y,z);
    createMeshObjItem(1,mesh.id,mesh.rotation);
}
/**********缩放***************/
function updateMeshScalingX(vl){
    var mesh = select_mesh;
	mesh.scaling.x = parseFloat(vl);
    createMeshObjItem(2,mesh.id,mesh.scaling);
}
function updateMeshScalingY(vl){
    var mesh = select_mesh;
	mesh.scaling.y = parseFloat(vl);
    createMeshObjItem(2,mesh.id,mesh.scaling);
}
function updateMeshScalingZ(vl){
    var mesh = select_mesh;
	mesh.scaling.z = parseFloat(vl);
    createMeshObjItem(2,mesh.id,mesh.scaling);
}

//删除网格
function removeMesh(){
    /*if (select_mesh!=null){
        for (var i = 0; i < select_meshes.length;i++){
            scene.removeMesh(select_mesh);
		}
	}
	else{
		//未选择mesh
		console.log("未选择网格");
	}*/
    if (select_mesh) {
        scene.removeMesh(select_mesh);
    }
}
//创建box
function createBoxMesh(){
    setCreateMeshKind("正方体");
    var mesh_id = 'box' + getDateToName();
    var box = new BABYLON.MeshBuilder.CreateBox(mesh_id, { height: 50, width: 50, depth: 20, updatable: true }, scene);
    box.material = mat_outlook;
    all_meshes.push(box);
    createAddMeshItem(box);
}
//创建球体
function createSphereMesh(){
    setCreateMeshKind("球体");
    var mesh_id = 'sphere' + getDateToName();
	var sphere = new BABYLON.MeshBuilder.CreateSphere(mesh_id,{diameter:20,diameterX:50,diameterY:50,diameterZ:50,arc:2,slice:2,updatable:true},scene);
    sphere.material = mat_outlook;
    all_meshes.push(sphere);
    addMesh(sphere);
}
//创建面
function createPlaneMesh(){
    setCreateMeshKind("平面");
    var mesh_id = "plane" + getDateToName();
    var plane = new BABYLON.MeshBuilder.CreatePlane(mesh_id, { size: 50, width: 50, height: 50, updatable: true }, scene);
    plane.material = mat_outlook;
    all_meshes.push(plane);
    createAddMeshItem(plane);
}
//创建地面
function createGroundMesh(){
    setCreateMeshKind("地面");
    var mesh_id = "ground" + getDateToName();
    var ground1 = BABYLON.MeshBuilder.CreateGround(mesh_id, { width: 60, height: 40, subdivsions: 40 }, scene);
    ground1.material = mat_outlook;
    all_meshes.push(ground1);
    createAddMeshItem(ground1);
}
//创建直线
function createLineMesh(){
	setCreateMeshKind("直线");
	var points = [
		new BABYLON.Vector3(0, 0, 0),
    	new BABYLON.Vector3(0, 70, 0)
    ];
    var mesh_id = 'line' + getDateToName();
    var line = new BABYLON.MeshBuilder.CreateLines(mesh_id, { points: points, updatable: true }, scene);   
    line.color = new BABYLON.Color3(1, 0, 0);
    all_meshes.push(line);
    createAddMeshItem(line);
}
//创建圆柱体
function createCylinderMesh(){
	setCreateMeshKind("圆柱体");
	//height:高度；
	//diameter：直径；
	//diameterTop:上部直径；
	//diameterBottom:下部直径;
	//tessellation:镶嵌(默认24,3棱镜)
	//subdivisions:细分，根据圆柱体高度细分，default：1
	//hasRings :boolean,?true:false 使细分相互独立,因此他们成为不同的面
	//enclose :附上 将每一个细分的两个额外的脸添加到一个切片的圆柱体上，以围绕它的高度轴关闭它
	//cap:封口方式：BABYLON.Mesh.NO_CAP,CAP_START,CAP_END,CAP_ALL(默认)；
	//arc:弧 default：1，是应用于切割圆柱体的周长的比率（最大值1）
	//faceColors:Color4[]
	//faceUV:Vector4[]
	//sideOrientation:边方向 number
	//updatabl:更新 boolean
	//createCylinder(name,{height:2,diameter:1,diameterTop:1,diameterBottom:1,tessellation:24，subdivisions:1,})
    var mesh_id = "cylinder" + getDateToName();
    var cylinder = new BABYLON.MeshBuilder.CreateCylinder(mesh_id, { height: 50, diameter: 50 }, scene);
    cylinder.material = mat_outlook;
    all_meshes.push(cylinder);
    createAddMeshItem(cylinder);
}
//圆锥体
function createConeMesh(){
    var mesh_id = "cone" + getDateToName();
    var cone = new BABYLON.MeshBuilder.CreateCylinder(mesh_id, { height: 50, diameterTop: 0 ,diameterBottom:50}, scene);
    cone.material = mat_outlook;
    all_meshes.push(cone);
    createAddMeshItem(cone);
}
//创建虚线(错误)
function createDashedLinesMesh()
{
    setCreateMeshKind("虚线");
    var points = [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 70, 0)
    ];
    var mesh_id = "dashline" + getDateToName();
	var dashLines = new BABYLON.CreateDashedLines(mesh_id,{points:points,updatable:true},scene);
    dashLines.material = mat_outlook;
    all_meshes.push(dashLines);
    createAddMeshItem(dashLines);
}
function _createsixCylinder(){
    var mesh_id = 'cir' + getDateToName();
    var cylinder = new BABYLON.Mesh.CreateCylinder(mesh_id,50,50,50,80,6,30,scene);
    all_meshes.push(cylinder);
    createAddMeshItem(cylinder);
}
//挤压自定义
/*function createExtrudeShapeCustom()
{
	//shape:vector3[]
	//path:vector3[]
	//rotationFunction()
	//scaleFunction()
	//ribbonCloseArry:boolean
	//ribbonClosePath:boolean
	//cap:number
	//instance:mesh
	//frontUVs:Vector4
	//updatable:boolean
	//invertUV:boolean(反面UV)
    setCreateMeshKind("自定义");
    var mesh_id = 'extrudeShapeCustom' + getDateToName();
	var extrudeShapeCustom = new BABYLON.MeshBuilder.ExtrudeShapeCustom(mesh_id,{},scene);
    extrudeShapeCustom.material = mat_outlook;
    all_meshes.push(extrudeShapeCustom);
    createAddMeshItem(extrudeShapeCustom);
}
//挤压形状
function createExtrudeShapeMesh(){
	//shape:Vector3[]
	//path:Vector3[]
	//rotation:number
	//scale:number
	//cap:number
	//backUVs:Vector4
	//sideOrientation:number
	//updatable:true
	//instance:mesh
	//frontUVs:Vector4
    var mesh_id = 'extrudeshape' + getDateToName();
	var extrudeShape = new BABYLON.MeshBuilder.ExtrudeShape(mesh_id,{},scene);
    extrudeShape.material = mat_outlook;
    all_meshes.push(extrudeShape);
    createAddMeshItem(extrudeShape);
}*/
//多边形
function createExtrudePolygonMesh(){
	//backUVs:vector4
	//depath:number
	//faceColors:Color4[]
	//faceUV:Vector4[]
	//frontUVs:Vector4
	//holes:Vector3[][]
	//shape:Vector3[]
	//sideOrientation:number
	//update:boolean
    /*setCreateMeshKind("多边形");
    var mesh_id = 'extrudePolygon' + getDateToName();
	var extrudePolygon = new BABYLON.MeshBuilder.Extrudepolygon(mesh_id,{},scene);
    extrudePolygon.material = mat_outlook;
    all_meshes.push(extrudePolygon);
    createAddMeshItem(extrudePolygon);*/
    var mesh_id = 'cir' + getDateToName();
    var cylinder = new BABYLON.Mesh.CreateCylinder(mesh_id,50, 50, 50, 6, 1,scene,true);
    all_meshes.push(cylinder);
    createAddMeshItem(cylinder);
}
//管子(错误)
function createTubeMesh(){
	//arc:number
	//backUVs:Vector4
	//cap:number
	//frontUVs:
	//instance:mesh
	//invertUV:boolean
	//path:vector3[]
	//radius:number 半径
	//radiusFunction(i:number,distance:number)
	//sideOrientation:number
	//tessellation:number
	//updatable:boolean
    setCreateMeshKind("管");
    var mesh_id = 'tube' + getDateToName();
	//var tube = new BABYLON.MeshBuilder.CreateTube(mesh_id,{radius:10},scene);
    var curve = function(){
        var l = 40;
        var t = 100;
        var path = [];
        var step = l / t;
        var a = 5;
        for (var i = -l/2; i < l/2; i += step ) {
            path.push( new BABYLON.Vector3(5 * Math.sin(i*t / 400), i, 5 * Math.cos(i*t / 400)) );
         }
        return path;
    };
    var tube = BABYLON.Mesh.CreateTube("tube", curve(), 10, 60, null, 0, scene, false, BABYLON.Mesh.FRONTSIDE);
    tube.material = mat_outlook;
    all_meshes.push(tube);
    createAddMeshItem(tube);
}
//环形结
function createTorusKnotMesh(){
	//backUvs:Vector4
	//frontUVs:Vector4
	//p:number
	//q:number
	//radialSegments:number//半径段
	//radius:number
	//sideOrientation:number
	//tube:number
	//tubularSegments:number
	//updatable:boolean
    setCreateMeshKind("环形结");
    var mesh_id = "toruskont" + getDateToName();
	//var torus_kont = new BABYLON.MeshBuilder.CreateTorusKnot(mesh_id,{},scene);
    var torus_kont = new BABYLON.Mesh.CreateTorusKnot(mesh_id, 40, 10, 128, 64, 2, 3, scene);
    torus_kont.material = mat_outlook;
    all_meshes.push(torus_kont);
    createAddMeshItem(torus_kont);
}
//环形面
function createTorusMesh()
{
	//backUVs?: Vector4
	// diameter?: number
	// frontUVs?: Vector4
	// sideOrientation?: number
	// tessellation?: number
	// thickness?: number
	// updatable?: boolean
    setCreateMeshKind("环形面");
    var mesh_id = "torus" + getDateToName();
	var torus = new BABYLON.MeshBuilder.CreateTorus(mesh_id,{thickness:20,diameter:70,tessellation:128},scene);
    torus.material = mat_outlook;
    all_meshes.push(torus);
    createAddMeshItem(torus);
}
//贴花
function createDecalMesh(){
	//angle:number
	//normal:Vector3
	//position:Vector3
	//size:Vector3
	setCreateMeshKind("贴花");
	var decal = new BABYLON.MeshBuilder.CreateDecal("decal",sourceMesh,{},scene);
    createAddMeshItem(decal);
}
function meshVertexData() {
    if (select_mesh) {
        select_mesh.material.wireframe = true;
        gizmo_manager.attachToMesh(null);
        var mesh = select_mesh;
        var vertex_color = mesh.geometry.getVerticesData(BABYLON.VertexBuffer.ColorKind);//点颜色
        var vertex_position = mesh.geometry.getVerticesData(BABYLON.VertexBuffer.PositionKind);//点
        var vertex_nb = vertex_position.length / 3;
        console.log(vertex_nb);
        if (!vertex_color) {
            vertex_color = new Array(4 * vertex_nb);
            vertex_color = vertex_color.fill(1);
            var color = new BABYLON.Color4(1, 0, 0, 1);
            for (var i = 0; i < vertex_nb; i++) {
                vertex_color[4 * i] = color.r;
                vertex_color[4 * i + 1] = color.g;
                vertex_color[4 * i + 2] = color.b;
                vertex_color[4 * i + 3] = color.a;
            }
            select_mesh.geometry.setVerticesData(BABYLON.VertexBuffer.ColorKind, vertex_color, true);
        }
        flag.editor = true;  
    }
    showAndColseRightMenu();
}
function updateMeshVertexData(mesh) {
    if (mesh.material) {
        mesh.material.wireframe = false;
        var point_length = select_mesh.geometry.getTotalVertices();
        var colors = [];
        colors = colors.fill(1);
        var color = new BABYLON.Color3.Gray();
        for (var i = 0; i < point_length; i++) {
            colors[4 * i] = 0.5;
            colors[4* i + 1] = 0.5;
            colors[4 * i + 2] = 0.5;
            colors[4 * i + 3] =1;
        }
        select_mesh.geometry.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors, true);
    } 
}
function getScenePosition() {
    var ray = scene.createPickingRay(scene.pointerX, scene.pointerY,
        BABYLON.Matrix.Identity(), camera_additional, false);
    var alpha = camera.alpha.toFixed(2);
    var beta = camera.beta.toFixed(2);
    var normal_y = Math.sin(beta)*5;
    var normal_tmp = Math.cos(beta)*5;
    var normal_x = Math.cos(alpha) * normal_tmp;
    var normal_z = Math.sin(alpha) * normal_tmp;
    var plane = new BABYLON.Plane.FromPositionAndNormal(BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(normal_x, normal_y, normal_z));
    var cur_point = null;
    var cur_dot = BABYLON.Vector3.Dot(ray.direction, plane.normal);
    if (cur_dot !== 0.0) {
        var tmp = -plane.signedDistanceTo(ray.origin) / cur_dot;
        if (tmp >= 0.0) {
            var cur_dirs = ray.direction.scale(tmp);
            cur_point = ray.origin.add(cur_dirs);
        }
    }
    if (!cur_point) {
        return null;
    }
    return cur_point;

}
function editorableApplyMesh(position_list) {
    if (!select_mesh || position_list.length<3)
        return false;
    var pos = [];
    var indices = [];//索引
    var normals = [];//向量
    for (var i = 0; i < position_list.length; i++) {
        
        if (i > 2) {
            indices.push(i);
            indices.push(i - 1);
            indices.push(i - 2);
        }
        else {
            indices.push(i);
        }
        pos[3 * i] = position_list[i].x;
        pos[3 * i + 1] = position_list[i].y;
        pos[3 * i + 2] = position_list[i].z;
    }
    BABYLON.VertexData.ComputeNormals(pos, indices, normals);
    
    var vertex_data = new BABYLON.VertexData();
    vertex_data.positions = pos.concat();
    vertex_data.indices = indices.concat();
    vertex_data.normals = normals.concat();
    var mesh_id = "trangle_" + getDateToName();
    var mesh = new BABYLON.Mesh(mesh_id, scene);
    vertex_data.applyToMesh(mesh, true);
    mesh.material = mat_outlook;
    all_meshes.push(mesh);
    return true;
}
//将网格加入到场景中
function addMesh(mesh){
    //console.log("addMesh"+mesh.position);
    /*var new_mesh = new BABYLON.Mesh(mesh.id,scene);
    new_mesh = mesh;
    all_meshes.push(new_mesh);*/
    scene.addMesh(mesh);
    //var obj = ["addMesh",mesh];
    //pushBackHistory(obj);
}
//删除网格
function deleteMesh(mesh){
    //var obj = ["deleteMesh",mesh];
    //mesh.dispose();
    scene.removeMesh(mesh);
}
//网格增加，放入历史
function createAddMeshItem(mesh){
    var obj = ["addMesh",mesh];
    if(!mesh.material){
        mesh.material = mat_default;
    }
    pushBackHistory(obj);
}
//mesh移动、缩放、旋转Item
function createMeshObjItem(opt,mesh_id,val){
    var option = "";
    switch(opt) {
     case 0:
        option = "moveMesh";
        break;
     case 1:
        option = "rotationMesh";
        break;
     default:
        option = "scaleMesh";
    } 
    var obj = [option,mesh_id,val];
    pushBackHistory(obj);
}
//mesh的material Item
function createMeshmaterialItem(material){
    var obj = ["modifyMaterial",material];
    pushBackHistory(obj);
}
//修改网格位置
function inAdjustMove(mesh_id,val){
   var mesh = querySceneMesh(mesh_id);
   if(mesh){
        mesh.position = val;
   }
}
//修改网格缩放
function inAdjustScale(mesh_id,val){
    var mesh = querySceneMesh(mesh_id);
   if(mesh){
        mesh.scaling = val;
   }
}
//修改网格旋转
function inAdjustRoa(mesh_id,val){
    var mesh = querySceneMesh(mesh_id);
    if(mesh){
        mesh.rotation = val;
    }
}
//查找对应的网格
function querySceneMesh(mesh_id){
    var meshes = scene.meshes;
    //var mesh = null;
    for(var i = 0;i<meshes.length;i++){
        if(meshes[i].id == mesh_id){
            return meshes[i];
        }
    }
    return null;
}
//修改对应的纹理
function inAdjustMaterial(mesh_id,material){
    var mesh = querySceneMesh(mesh_id);
    if(material==undefined || material == null)
    {
        return;
    }
    if(mesh){
        var choose_material = querySceneMaterial(material.id);
        if(choose_material){
            choose_material = material;
            mesh.material = choose_material;
        }
    }
    
}
function querySceneMaterial(material_id){
    var materials = scene.materials;
    for(var i=0;i<materials;i++){
        if(materials[i].id == material_id){
            return materials[i];
        }
    }
    return null;
}
