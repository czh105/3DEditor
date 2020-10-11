function createCurrentPlane(start,end){
    var plane = new BABYLON.Plane.FromPositionAndNormal(start,end.subtract(start));
    return plane;
}
function getCurrentReactPoint(start,end){
    //获取该点在画布上的二维坐标
    var start_vect2 = vector3ConvertVector2(start);
    var end_vect2 = vector3ConvertVector2(end);
    var cur_plane = createCurrentPlane(start,end);
    var start_down = {};
    start_down.x = start_vect2.x;
    start_down.y = end_vect2.y;
    var end_up = {};
    end_up.x = end_vect2.x;
    end_up.y = start_vect2.y;
    var left = calculateIntoSpace(start_vect2,cur_plane);
    var right = calculateIntoSpace(end_vect2,cur_plane);
    var left_down = calculateIntoSpace(start_down,cur_plane);
    var right_up = calculateIntoSpace(end_up,cur_plane);
    var points = [left,right_up,right,left_down,left];
    react_line = new BABYLON.MeshBuilder.CreateLines("", { points: points }, scene);
    react_line.color = new BABYLON.Color3(0,1,0);
}
function vector3ConvertVector2(point){
    var vect2 = BABYLON.Vector3.Project(point,
    BABYLON.Matrix.Identity(),
    scene.getTransformMatrix(),
    camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));
    return vect2;
}
function calculateIntoSpace(vect2,plane){
    //var ray = scene.createPickingRay(vect2.x, vect2.y,
        //BABYLON.Matrix.Identity(), camera_additional, false);
    
    var ray = scene.createPickingRay(vect2.x, vect2.y,
        BABYLON.Matrix.Identity(), camera, false);
    var cur_point = null;
    var cur_dot = BABYLON.Vector3.Dot(ray.direction, plane.normal);
    if (cur_dot !== 0.0) {
        var tmp = -plane.signedDistanceTo(ray.origin) / cur_dot;
        if (tmp >= 0.0) {
            var cur_dirs = ray.direction.scale(tmp);
            cur_point = ray.origin.add(cur_dirs);
        }else{
            tmp = - tmp;
            var cur_dir = ray.direction.scale(tmp);
            cur_point = ray.origin.add(cur_dir);
        }
    }
    if (!cur_point) {
        return null;
    }
    
    return cur_point;
}