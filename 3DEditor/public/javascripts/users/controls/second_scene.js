var mouseOff = false;//是否长按
var view_select_mesh;
function createNewScene() {
    second_scene = new BABYLON.Scene(second_engine);
    second_scene.collisionsEabled = true;
    second_scene.clearColor = new BABYLON.Color3(0.5,0.5,0.5);
    //旋转相机
    second_camera =  new BABYLON.ArcRotateCamera("view_camera", -Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3.Zero(), second_scene);
    second_camera.attachControl(view_canvas, true);
    second_camera.lowerBetaLimit = 0;
    second_camera.upperBetaLimit = Math.PI/2;
    var view_mat = new BABYLON.StandardMaterial("view_mat",second_scene);//视角材质
    var mat_view = new BABYLON.StandardMaterial("mat_view", second_scene);
    var view_light = new BABYLON.HemisphericLight("light_view", new BABYLON.Vector3(0, -4, 0), second_scene);
    view_light.diffuse = new BABYLON.Color3(1, 1, 1);
    view_light.specular = new BABYLON.Color3(0, 0, 0);
    view_light.groundColor = new BABYLON.Color3(0.7, 0.7, 0.7);
    //第二视角立方体
    //***************************************************************增加第二视角*********************************************************
    //1、前视角 9个 
    //vector4(bottom_x,bottom_y,top_x,top_y)
    let front_view = new BABYLON.MeshBuilder.CreateBox("front_view", { width: 1, height: 1, depth: 1}, second_scene);
    front_view.position = new BABYLON.Vector3(0, 0, -1);
    let view_front_material = new BABYLON.StandardMaterial("view_front_mat", second_scene);
    view_front_material.diffuseTexture = new BABYLON.Texture("../system/textures/front_view.jpg", second_scene);
    front_view.material = view_front_material;
    let front_upper_view = new BABYLON.MeshBuilder.CreateBox("front_upper_view", { width: 1, height: 1, depth: 1 }, second_scene);
    front_upper_view.position = new BABYLON.Vector3(0, 1, -1);
    front_upper_view.material = new BABYLON.StandardMaterial("mat_front_upper_view", second_scene);
    let front_lower_view = new BABYLON.MeshBuilder.CreateBox("front_lower_view", { width: 1, height: 1, depth: 1 }, second_scene);
    front_lower_view.position = new BABYLON.Vector3(0, -1, -1);
    //front_lower_view.material = mat_view;
    let front_left_view = new BABYLON.MeshBuilder.CreateBox("front_left_view", { width: 1, height: 1, depth: 1 }, second_scene);
    front_left_view.position = new BABYLON.Vector3(-1, 0, -1);
    front_left_view.material = new BABYLON.StandardMaterial("mat_front_left_view", second_scene);

    let front_right_view = new BABYLON.MeshBuilder.CreateBox("front_right_view", { width: 1, height: 1, depth: 1 }, second_scene);
    front_right_view.position = new BABYLON.Vector3(1, 0, -1);
    front_right_view.material = new BABYLON.StandardMaterial("mat_front_right_view", second_scene);

    let front_upper_left_view = new BABYLON.MeshBuilder.CreateBox("front_upper_left_view", { width: 1, height: 1, depth: 1 }, second_scene);
    front_upper_left_view.position = new BABYLON.Vector3(-1, 1, -1);
    front_upper_left_view.material = new BABYLON.StandardMaterial("mat_front_upper_left_view", second_scene);

    let front_upper_right_view = new BABYLON.MeshBuilder.CreateBox("front_upper_right_view", { width: 1, height: 1, depth: 1 }, second_scene);
    front_upper_right_view.position = new BABYLON.Vector3(1, 1, -1);
    front_upper_right_view.material = new BABYLON.StandardMaterial("mat_front_upper_right_view", second_scene);

    let front_lower_left_view = new BABYLON.MeshBuilder.CreateBox("front_lower_left_view", { width: 1, height: 1, depth: 1 }, second_scene);
    front_lower_left_view.position = new BABYLON.Vector3(-1, -1, -1);
    //front_lower_left_view.material = mat_view;
    let front_lower_right_view = new BABYLON.MeshBuilder.CreateBox("front_lower_right_view", { width: 1, height: 1, depth: 1 }, second_scene);
    front_lower_right_view.position = new BABYLON.Vector3(1, -1, -1);
    //front_lower_right_view.material = mat_view;
    //2、后视角 9个
    let back_view = new BABYLON.MeshBuilder.CreateBox("back_view", { width: 1, height: 1, depth: 1}, second_scene);
    back_view.position = new BABYLON.Vector3(0, 0, 1);
    let view_back_material = new BABYLON.StandardMaterial("view_back_mat", second_scene);
    view_back_material.diffuseTexture = new BABYLON.Texture("../system/textures/back_view.jpg", second_scene);
    back_view.material = view_back_material;
    back_view.rotation.x = Math.PI / 2;
    back_view.rotation.z = Math.PI / 2;
    let back_upper_view = new BABYLON.MeshBuilder.CreateBox("back_upper_view", { width: 1, height: 1, depth: 1 }, second_scene);
    back_upper_view.position = new BABYLON.Vector3(0, 1, 1);
    back_upper_view.material = new BABYLON.StandardMaterial("mat_back_upper_view", second_scene);

    let back_lower_view = new BABYLON.MeshBuilder.CreateBox("back_lower_view", { width: 1, height: 1, depth: 1 }, second_scene);
    back_lower_view.position = new BABYLON.Vector3(0, -1, 1);

    let back_left_view = new BABYLON.MeshBuilder.CreateBox("back_left_view", { width: 1, height: 1, depth: 1 }, second_scene);
    back_left_view.position = new BABYLON.Vector3(-1, 0, 1);
    back_left_view.material = new BABYLON.StandardMaterial("mat_back_left_view", second_scene);

    let back_right_view = new BABYLON.MeshBuilder.CreateBox("back_right_view", { width: 1, height: 1, depth: 1 }, second_scene);
    back_right_view.position = new BABYLON.Vector3(1, 0, 1);
    back_right_view.material = new BABYLON.StandardMaterial("mat_back_right_view", second_scene);

    let back_upper_left_view = new BABYLON.MeshBuilder.CreateBox("back_upper_left_view", { width: 1, height: 1, depth: 1 }, second_scene);
    back_upper_left_view.position = new BABYLON.Vector3(-1, 1, 1);
    back_upper_left_view.material = new BABYLON.StandardMaterial("mat_back_upper_left_view", second_scene);

    let back_upper_right_view = new BABYLON.MeshBuilder.CreateBox("back_upper_right_view", { width: 1, height: 1, depth: 1 }, second_scene);
    back_upper_right_view.position = new BABYLON.Vector3(1, 1, 1);
    back_upper_right_view.material = new BABYLON.StandardMaterial("mat_back_upper_right_view", second_scene);

    let back_lower_left_view = new BABYLON.MeshBuilder.CreateBox("back_lower_left_view", { width: 1, height: 1, depth: 1 }, second_scene);
    back_lower_left_view.position = new BABYLON.Vector3(-1, -1, 1);
    let back_lower_right_view = new BABYLON.MeshBuilder.CreateBox("back_lower_right_view", { width: 1, height: 1, depth: 1 }, second_scene);
    back_lower_right_view.position = new BABYLON.Vector3(1, -1, 1);
    //3、左视角 3个
    let left_view = new BABYLON.MeshBuilder.CreateBox("left_view", { width: 1, height: 1, depth: 1}, second_scene);
    left_view.position = new BABYLON.Vector3(-1, 0, 0);
    let view_left_material = new BABYLON.StandardMaterial("mat_left_view", second_scene);
    view_left_material.diffuseTexture = new BABYLON.Texture("../system/textures/left_view.jpg", second_scene);
    left_view.material = view_left_material;
    left_view.rotation.y = Math.PI / 2;

    let left_upper_view = new BABYLON.MeshBuilder.CreateBox("left_upper_view", { width: 1, height: 1, depth: 1 }, second_scene);
    left_upper_view.position = new BABYLON.Vector3(-1, 1, 0);
    left_upper_view.material = new BABYLON.StandardMaterial("mat_left_upper_view", second_scene);

    let left_lower_view = new BABYLON.MeshBuilder.CreateBox("left_lower_view", { width: 1, height: 1, depth: 1 }, second_scene);
    left_lower_view.position = new BABYLON.Vector3(-1, -1, 0);
    //4、右视角 3个
    let right_view = new BABYLON.MeshBuilder.CreateBox("right_view", { width: 1, height: 1, depth: 1 }, second_scene);
    right_view.position = new BABYLON.Vector3(1, 0, 0);
    let view_right_material = new BABYLON.StandardMaterial("mat_right_view", second_scene);
    view_right_material.diffuseTexture = new BABYLON.Texture("../system/textures/right_view.jpg",second_scene);
    right_view.material = view_right_material;
    right_view.rotation.x = Math.PI / 2;
    let right_upper_view = new BABYLON.MeshBuilder.CreateBox("right_upper_view", { width: 1, height: 1, depth: 1 }, second_scene);
    right_upper_view.position = new BABYLON.Vector3(1, 1, 0);
    right_upper_view.material = new BABYLON.StandardMaterial("mat_right_upper_view", second_scene);

    let right_lower_view = new BABYLON.MeshBuilder.CreateBox("right_lower_view", { width: 1, height: 1, depth: 1 }, second_scene);
    right_lower_view.position = new BABYLON.Vector3(1, -1, 0);
    //5、俯视角 1个
    let upper_view = new BABYLON.MeshBuilder.CreateBox("upper_view", { width: 1, height: 1, depth: 1}, second_scene);
    upper_view.position = new BABYLON.Vector3(0, 1, 0);
    let view_upper_material = new BABYLON.StandardMaterial("mat_upper_view", second_scene);
    view_upper_material.diffuseTexture = new BABYLON.Texture("../system/textures/upper_view.jpg");
    upper_view.material = view_upper_material;
    upper_view.rotation.x = Math.PI / 2;
    //6、仰视角 1个
    let lower_view = new BABYLON.MeshBuilder.CreateBox("mat_lower_view", { width: 1, height: 1, depth: 1 }, second_scene);
    lower_view.position = new BABYLON.Vector3(0, -1, 0);
    second_scene.onPointerDown = function (evt, pick_result) {
        if (pick_result.hit) {//通过点击控制相机视角
            mouseOff = true;
            if (pick_result.pickedMesh != null) {
                if (view_select_mesh != null) {
                    view_select_mesh.material.diffuseColor = new BABYLON.Color3.FromHexString("#fafafa");
                }
                let pick_mesh_name = pick_result.pickedMesh.id;
                for (var j = 0; j < views_name.length; j++) {
                    if (pick_mesh_name == views_name[j]) {
                        console.log(pick_result.pickedMesh.id);
                        view_select_mesh = pick_result.pickedMesh;
                        view_select_mesh.material.diffuseColor = new BABYLON.Color3.Red();
                        second_camera.alpha = Math.PI * view_alpha_beta[j][0];
                        camera.alpha = second_camera.alpha;
                        second_camera.beta = Math.PI * view_alpha_beta[j][1];
                        camera.beta = second_camera.beta;
                        break;
                    }
                }
            }
        }
    }
    second_scene.onPointerMove = function () {              
        camera.beta = second_camera.beta;
        camera.alpha = second_camera.alpha;
        scene.render();
    }
    second_scene.onPointerUp = function () {
        mouseOff = false;
        setCameraPosition();
    }
	/******************************************************************************************************************************/
    return second_scene;
}
//获取视角
var views_name = ["front_view", "front_upper_view", "front_left_view", "front_right_view", "front_upper_left_view", "front_upper_right_view",
     "back_view", "back_upper_view", "back_left_view","back_right_view", "back_upper_left_view",
    "back_upper_right_view", "left_view", "left_upper_view", "right_view","right_upper_view", "upper_view"];
var view_alpha_beta = [[1.5, 0.5], [1.5, 0.25], [1.25, 0.5], [1.75, 0.5], [-0.75, 0.25], [0.25, 0.25], [0.5, 0.5],
[0.5, 0.25], [0.75, 0.5], [0.25, 0.5], [-1.25, 0.25], [-1.75, 0.25], [-1, 0.5], [-1, 0.25], [0, 0.5], [0, 0.25], [1.5, 0]];
   
