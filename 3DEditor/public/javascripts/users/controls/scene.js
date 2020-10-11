/***************场景建设**************/
/**
 * 
 */
//全局变量
/*var scene;*/
var user_id = $.cookie("userid");//用户id
var project_name = $.cookie("projectname");//项目名称
var camera;//主相机
var camera_additional;//附加相机
var light;//主光源
var lights = [];//光源
var materials = [];//材质
var textures = [];//纹理
var all_meshes = [];//当前mesh
var select_mesh;//选中的mesh
var select_meshes = [];//选择多个网格
var select_meshes_sub = [];
var is_select_meshes = false;//是否选择多个meshes
var sprites = [];//精灵
//var history = [];//历史
var back_history = [];
var undo_history = [];
var ground;//地面
var allbase_mesh;
var mat_outlook;//背面不可见材质
var trangle_hold;//当前焦点三角形
var mat_frame;//网格材质
var gizmo_manager;//旋转、移动、缩放控制
var mesh_outlook;//标记网格
var mat_default;//默认网格
var scale_size;//比例尺
var down_position;//点击时，默认射线的原点
var projector_plane;//投影面
//第二场景
//第二视角控制
var view_canvas = document.getElementById('view_canvas');
var second_engine = new BABYLON.Engine(view_canvas, true);
var second_scene;//第二视角场景
var second_camera;//第二视角相机
var react_line;
var editor_point_mesh = [];//可编辑点数组
var mat_grass;
//全局状态标志
var flag = {
    sceneCharger: false//场景是否加载完毕
    , freeControl: false//是否使用自由浏览视角
    , editor:false//可编辑点 
    //, adminClent: false//是否是主持人客户端
    , pickType: "default"//鼠标点选类型：default、point、tryangle、mesh
    , conbineType: 0//网格融合模式，新建0、融合1、切削2
    , mouseOff: false//是否保持鼠标长按
    //, holdMode: null//如何调整焦点物体
};
//二维窗口交互变量
var clientX = 0;
var clientY = 0;
var starting_point = 0;
var current_mesh;
var mouse_client = new BABYLON.Vector3(0, 0, 0);
var dragging = false;//是否允许拖拽
var mesh_collison_with_ground_y = null;//与地面碰撞时网格的位置
/***开始***/
var canvas = document.getElementById("renderCanvas");
var ray_direct;//射线方向
var canvas_left = 0;
var canvas_top = 40;
var divFps;//帧数
var intersect_material;
var cancel_history = [];
var back_history = [];
var mat_point;//可编辑点材质
var editor_first_line;//可编辑网格的第一条直线
var editor_second_line;//可编辑网格的第二条直线
var editor_point = []; //所在点的编辑
var engine = new BABYLON.Engine(canvas, true);
BABYLON.SceneLoader.ShowLoadingScreen = false;
window.onload = webGLStart();
function webGLStart() {
    gl = engine._gl;
    createScene();
    createNewScene();
}
function createScene(){
	scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
   
    scene.clearColor = new BABYLON.Color3(0.45, 0.45, 0.5);
	//点光源    
	light = new BABYLON.PointLight("Hemi0", new BABYLON.Vector3(-600, 600, -800), scene);
    //light.diffuse = new BABYLON.Color3(1,1,1);//这道“颜色”是从上向下的，底部收到100%，侧方收到50%，顶部没有
    light.specular = new BABYLON.Color3(0,0,0);
    //light.groundColor = new BABYLON.Color3(1,1,1);//这个与第一道正相反
    //light =  new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);
	//light.intensity = 0.7;
    projector_plane = new BABYLON.Plane(0,1,0,5);//新建投影面
	//旋转相机
	camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI/4, 1300, new BABYLON.Vector3.Zero(), scene);
    camera_additional = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 1300, new BABYLON.Vector3.Zero(), scene);
    
    camera.checkCollisions = true;
    camera.lowerBetaLimit = 0;
    camera.upperBetaLimit = Math.PI / 2;
    scene.activeCamera = camera;
    setCameraPosition();
	//网格材质
	mat_default = new BABYLON.StandardMaterial("mat_default",scene);
	mat_default.diffuseColor = new BABYLON.Color3.Gray();
	/*mat_frame = new BABYLON.StandardMaterial("mat_frame",scene);
    mat_frame.wireframe = true;
    mat_point = new BABYLON.StandardMaterial("mat_point", scene);
    mat_point.diffuseColor = new BABYLON.Color3(1, 0, 0);
	//材质
	mat_outlook = new BABYLON.StandardMaterial("mat_outlook",scene);
    mat_outlook.diffuseColor = new BABYLON.Color3.Gray();
	mat_outlook.backFaceCulling = false;
    intersect_material = new BABYLON.StandardMaterial("intersect_mat",scene);
    intersect_material.diffuseColor = new BABYLON.Color3.Red();*/
	//地面
	ground = BABYLON.Mesh.CreatePlane("ground",1200,scene);
	ground.position.y = -5;
	ground.rotation.x = Math.PI / 2;
    ground.checkCollisions = true;//开启碰撞检测
    //获取边界
    var bound_ground = ground._boundingInfo.boundingBox.vectorsWorld;
    for(var i = 0;i<bound_ground.length;i++){
    	if(bound_ground[i].y>-4.9){
    		bound_ground.y = 600;
    	}
    }
    ground._boundingInfo.boundingBox.vectorsWorld = bound_ground;
    //ground.collisionsEnabled = true;
    ground.ellipsoid = new BABYLON.Vector3(5, 5, 5);
	mat_grass = new BABYLON.StandardMaterial("mat_grass",scene);
    mat_grass.diffuseTexture = new BABYLON.Texture("../system/textures/grass.jpg",scene);
	mat_grass.diffuseTexture.uScale = 5.0;
	mat_grass.diffuseTexture.vScale = 5.0;
	mat_grass.diffuseTexture.hasAlpha = true;
	mat_grass.backFaceCulling = false;
	mat_grass.freeze();
	mat_grass.diffuseTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
	ground.material = mat_grass;
	//作为鼠标移动的基准
	//allbase_mesh = new BABYLON.Mesh("allbase",scene);

	gizmo_manager = new BABYLON.GizmoManager(scene);//网格行为的拖拽、平移、旋转
	//console.log("positionGizmo"+gizmoManager.positionGizmo);
	gizmo_manager.attachableMeshes = all_meshes;
	gizmo_manager.boundingBoxGizmoEnabled = true;
	//鼠标点击事件
	//鼠标移动事件监听
	canvas.onmousemove = function(evt){
		var evt = evt || window.event;
		clientX = evt.clientX;
		clientY = evt.clientY;
		$("#clientX").html("x:"+clientX+"px");
		$("#clientY").html("y:"+clientY+"px");
	};
	canvas.onmousedown = function(evt){
		var evt = evt || window.evevt;
		clientX = evt.clientX;
		clientY = evt.clientY;
		$("#clientX").html("x:"+clientX+"px");
		$("#clientY").html("y:"+clientY+"px");
    }
    /*主要是控制相机的视角相同*/
    //主场景中的鼠标抬起事件
    scene.onPointerUp = function (evt, pickResult) {
        if(flag.mouseOff){
        	 if(gizmo_manager._attachToMesh == undefined && select_mesh == null && down_position != null)  {
                if(react_line!=null){
                    react_line.dispose();
                }
	            selectMeshReact(pickResult.ray.origin);
	            if(select_meshes.length>0){
	                for(var i = 1;i<select_meshes.length;i++){
	                	var vec_sub = select_meshes[i].position.subtract(select_meshes[0].position);
	                	select_meshes_sub.push(vec_sub);
	                	select_meshes[i].setParent(select_meshes[0]);
	                }
	                gizmo_manager.attachToMesh(select_meshes[0]);
	            }
               
	        }
            else{
                
            }
	        flag.mouseOff = false; 
        }
       
    }
    
    //主场景中鼠标移动事件
    scene.onPointerMove = function (evt, pickResult) { 
        //console.log("移动:" + pickResult.ray.origin);
        if (flag.mouseOff)//长按时 
        {
            if (flag.pickType == 'mesh') {
                if(gizmo_manager._attachToMesh == undefined && select_mesh == null){
                    //选择多个网格时
                    if(react_line!=null){
                        react_line.dispose();
                    }
                    getCurrentReactPoint(down_position,pickResult.ray.origin);
                }
                else{
                    if (select_mesh != null && select_mesh != ground) {
                    setCurrentMeshData(select_mesh);
                    //判断碰撞
                    for (let index = 0; index < all_meshes.length; index++) {
                        if (select_mesh.id != all_meshes[index].id) {
                            if (select_mesh.intersectsMesh(all_meshes[index], false)) {
                                all_meshes[index].showBoundingBox = true;

                            } else {
                                all_meshes[index].showBoundingBox = false;
                            }

                        }
                    }
                    //限制不能埋入地面
                    if (select_mesh.intersectsMesh(ground, false)) {
                        select_mesh.position.y += 1;
                    }
                }
                }
                
            }
            else if (flag.pickType == 'trangle') {

            }
            else if (flag.pickType == 'point') {

            } 
        }
        else if (flag.editor)
        {
            if (editor_first_line) {
                editor_first_line.dispose();//释放内存
            }
            if (editor_second_line) {
                editor_second_line.dispose();//释放内存
            }
            var cur_point = getScenePosition();
            if (editor_point.length == 1) {
                editor_first_line = createLinePoint(editor_point[0], cur_point);
            }
            else if (editor_point.length >= 2) {
                //或直线
                var cur_index = editor_point.length - 1;
                editor_first_line = createLinePoint(editor_point[cur_index], cur_point);
                editor_second_line = createLinePoint(editor_point[cur_index - 1], cur_point);
            }
        }
        
    };
    
    //主场景中鼠标点击事件
    scene.onPointerDown = function (evt, pick_result) {
        if (pick_result.hit) {    	
        	//获取点击点原点位置       
            if (flag.editor) {
                getScenePosition();//测试
                if (select_mesh != null && select_mesh != ground) {
                    
                    if (evt.button == 0) {  
                        let cur_point = getScenePosition();
                        if (cur_point) {
                            editor_point.push(cur_point);
                            var point_mesh = createSpherePoint(cur_point);
                            editor_point_mesh.push(point_mesh);
                        } else {
                            return;
                        }
                        
                    }
                    else if (evt.button == 2) {
                        flag.editor = false;//退出可编辑状态
                        if(editor_point_mesh.length>0){
                            for (var i = 0; i < editor_point_mesh.length; i++) {
                                editor_point_mesh[i].dispose();//释放内存
                            } 
                        }
                        
                        if (editor_first_line) {
                            editor_first_line.dispose();//释放内存
                        }
                        if (editor_second_line) {
                            editor_second_line.dispose();//释放内存
                        }
                        //开始创建geometry
                        editorableApplyMesh(editor_point);
                        updateMeshVertexData(select_mesh);
                        editor_point = [];
                        //将选择好的点放入网格
                        
                    }
                }
            }
            else {
                if (evt.button == 0) {
                    select_mesh = null;
                    flag.mouseOff = true;
                    //down_position = pick_result.ray.origin;
                    if ($("#right_mouse_menu").not(":hidden")) {
                        $("#right_mouse_menu").css("display", "none");
                    }
                    if (flag.pickType == 'mesh') {
                        initMeshBoundingBox();//初始化网格的包围盒
                        if (pick_result.pickedMesh != null && pick_result.pickedMesh !== ground) {
                            //console.log("点击选择网格");
                            gizmo_manager.attachToMesh(select_mesh);
                            select_mesh = pick_result.pickedMesh;
                            initLeftMenu();
                            setCurrentMeshData(select_mesh);
                        }
                        else { 

                        	if(select_meshes.length>0){
                                //console.log("1:"+select_meshes[0]._localMatrix);
                                var rot = select_meshes[0].rotation;
                                var new_pivot = [];
                        		for(var i= 1;i<select_meshes.length;i++){	
                                    select_meshes[i].setParent(null);
                                    select_meshes[i].setPivotMatrix(BABYLON.Matrix.Translation(0,0,0),true);//创建空间坐标系   
                        		}
                                new_pivot= [];
                                select_meshes[0]._children = null;
                                select_meshes = [];
                                parent_mesh_clone = null;
                        		gizmo_manager.attachToMesh(null);//初始化为空
                                gizmo_manager.positionGizmoEnabled = false;
                                gizmo_manager.rotationGizmoEnabled = false;
                                gizmo_manager.scaleGizmoEnabled = false;
                                gizmo_manager.boundingBoxGizmoEnabled = true;
                               
                        	}
                            select_mesh = null; 
                            down_position = pick_result.ray.origin;
                            click_selectes_point = pick_result.pickedPoint;
                            ray_direct = pick_result.ray.direction;
                            gizmo_manager.attachToMesh(null);//初始化为空
                            initLeftMenu();
                            setCurrentMeshData(select_mesh);
                        }

                    }
                    else if (flag.pickType == 'tryangle') {
                        if (pick_result.pickedMesh != null && pick_result.pickedMesh !== ground) {
                            if (pick_result.faceId) {
                                console.log("进入三角面编辑");
                                pick_result.pickedMesh.material.wireframe = true;
                                flag.pickType = "default";
                                flag.holdMode = "trangle";
                                var face_id = pick_result.faceId;
                                var picked_mesh = pick_result.pickedMesh;
                                getTrangleData(picked_mesh, face_id);
                            }
                        }
                    }
                    else if (flag.pickType == 'point') {
                        console.log("tryangle");
                        
                    }
                }
                else if (evt.button == 1) {
                    //滑轮事件
                }
                else if (evt.button == 2) {

                    //取消可编辑
                    if (flag.editor) {
                        flag.editor = false;
                    }//鼠标右键
                    else {
                        if ($("#right_mouse_menu").not(":hidden")) {
                            $("#right_mouse_menu").css("display", "none");
                        }
                        if (pick_result.pickedMesh != null && pick_result.pickedMesh != ground) {
                            //console.log(evt);
                            showAndColseRightMenu(evt);
                        }
                    }
                }
            }
            
        }

    };
	//场景准备好执行
	scene.executeWhenReady(function(){
		canvas.style.opacity = 1;
		BABYLON.SceneLoader.ShowLoadingScreen = true;
	});
	//在注册前
	var count = 1;
	
	//场景处理中时
	scene.onDispose = function(){

    };
     scene.onBeforeRenderObservable.add(function(){
        light.position = camera.position;
    });
    
	
    /**/
   	BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;//更好加载纹理，但是加载时间过长
   	//如果导入obj文件的建模程序纹理可能出现变形或倒置，通过设置变量来修改导入的模型的UV坐标
   	//BABYLON.OBJFileLoader.UV_SCALE = new BABYLON.Vector2(xValue,yValue);
   	//某些OBJ文件包含顶点颜色。如果要加载这样的文件，并且想要带有颜色的顶点，请设置变量
   	BABYLON.OBJFileLoader.IMPORT_VERTEX_COLORS = false;
   	//如果是一个没有法线的obj文件，重新计算
   	BABYLON.OBJFileLoader.COMPUTE_NORMALS = true;
   	//默认情况下，如果无法加载MTL文件（丢失/错误），它将以静默方式失败。该模型仍将被加载，但是如果您要强制更严格地加载材料，则可以相应地使用onSuccess（）和onError（）回调。设置变量：
   	BABYLON.OBJFileLoader.MATERIAL_LOADING_FAILS_SILENTLY = true;
   	//OBJ中定义了MTL，但您希望忽略它
   	BABYLON.OBJFileLoader.SKIP_MATERIALS = false;
   	/******************END**********************/
	/*************************************测试结束***************************************************************/
	
    /*var points = [new BABYLON.Vector3(0,0,0),new BABYLON.Vector3(0,50,0),new BABYLON.Vector3(50,50,0),new BABYLON.Vector3(50,0,0)];
    var line = new BABYLON.MeshBuilder.CreateLines("", { points: points }, scene);
    line.color = new BABYLON.Color3(0,1,0);*/
	return scene;
}	
engine.runRenderLoop(function(){
	if(scene){
		scene.render();
	}
	scene.render();
});
window.addEventListener("resize",function(){
    engine.resize();
    second_engine.resize();
});
second_engine.runRenderLoop(function () {
    if (second_scene) {
        second_scene.render();
    }
});
/*************************************键盘输入事件监听*************************************************************/
var onContextmenu = function(evt){
	var evt = evt || window.event;
	var pointer = canvas.getPointer(evt);
	var object = canvas.getObjects();
	event.preventDefault();
};
/***************************************键盘输入事件监听EDN********************************************************/
function loadScenceFile(path,file_name) {
    //加载场景
    BABYLON.SceneLoader.Load(path, file_name, engine, function (new_scene) {
        scene = new_scene;
    });
}
function loadImportObjAndStlFile(path, file_name) {
    
    let loader = new BABYLON.AssetsManager(scene);
    var pos = function (t) {
        //console.log("加载模型："+t.loadedMeshes);
        t.loadedMeshes.forEach(function (mesh) {
            all_meshes.push(mesh);
        });
    };
    let obj_mesh = loader.addMeshTask("ss", "", path, file_name);
    
    obj_mesh.onSuccess = pos;
    loader.onFinish = function () {
        engine.runRenderLoop(function () {
            scene.render();
        });
    };
    loader.onError = function (err) {
        console.log("err"+err);
    }
    loader.load();
}
function loadImportMeshFile(path,file_name) {
    //加载模型
    console.log("加载模型");
    BABYLON.SceneLoader.ImportMesh("", path, file_name, scene, function (meshes, particle_systems, skeletons) {
        meshes.forEach(function (mesh) {
            all_meshes.push(mesh);
            if(mesh.parent != null){
                var position = mesh.position;
                var center = mesh._boundingInfo.boundingSphere.center;
                var radius = mesh._boundingInfo.boundingSphere.radius;
                if(center.y < 0){
                   mesh.position.y =  -(mesh._boundingInfo.boundingSphere.center.y/2) ;
                }
                if(radius < 50){
                    var scaling_value = (50/radius).toFixed(3);
                    mesh.scaling = new BABYLON.Vector3(scaling_value,scaling_value,scaling_value);
                }else if(radius >500){
                    var scaling_value = (500/radius).toFixed(3);
                    mesh.scaling = new BABYLON.Vector3(scaling_value,scaling_value,scaling_value);
                }
            }
        });
    });
    console.log("end load mesh");
}
function createSpherePoint(point) {
    if (!point) { return; }
    var sphere = new BABYLON.MeshBuilder.CreateSphere("", { diameter: 5 }, scene);
    
    sphere.material = mat_point;
    sphere.position = point;
    return sphere;
}
function createLinePoint(point1, point2) {
    var point = [point1, point2];
    var line = new BABYLON.MeshBuilder.CreateLines("", { points: point }, scene);
    line.color = new BABYLON.Color3(1, 0, 0);
    return line;
}
//设置相机的位置
function setCameraPosition() {
    var alpha = camera.alpha.toFixed(4);
    var beta = camera.beta.toFixed(4);
    //console.log(alpha + "," + beta);
    var position = camera.position;
    var x = position.x;
    var y = position.y;
    var z = position.z;
    camera_additional.setPosition(new BABYLON.Vector3(x,y,z));
}
