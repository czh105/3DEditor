function createTryanglemMesh(p1,p2,p3,mesh_id){
    console.log(mesh_id);
    var vertex_data = new BABYLON.VertexData();
    var positions = [p1.position[0],p1.position[1],p1.position[2],
                     p2.position[0],p2.position[1],p2.position[2],
                     p3.position[0],p3.position[1],p3.position[2]];
    var uvs = [p1.uv[0],p1.uv[1],p2.uv[0],p2.uv[1],p3.uv[0],p3.uv[1]];
    var normals = [p1.normal[0],p1.normal[1],p1.normal[2],
                   p2.normal[0],p2.normal[1],p2.normal[2],
                   p3.normal[0],p3.normal[1],p3.normal[2]];
    var indices = [0,1,2];
    //计算法线
    BABYLON.VertexData._ComputeSides(0,positions,indices,normals,uvs);
    vertex_data.indices = indices.concat();//添加索引
    vertex_data.positions = positions.concat();
    vertex_data.normals = normals.concat();//位置改变，法线也要随之变化
    vertex_data.uvs = uvs.concat();
    var mesh = new BABYLON.Mesh(mesh_id,scene);
    vertex_data.applyToMesh(mesh,true);
    mesh.vertexData = vertex_data;
    console.log(mesh);
    return mesh;
}
//获得三角面的数据如点的坐标，法线，uv
function getTrangleData(picked_mesh,face_id){
    
    //该三角面的索引
    var indices = [picked_mesh.geometry._indices[face_id * 3],
                   picked_mesh.geometry._indices[face_id * 3 + 1],
                   picked_mesh.geometry._indices[face_id * 3 + 2]];
    //顶点数据
    var vb = picked_mesh.geometry._vertexBuffers;
    //所选网格的所以点坐标
    var position = vb.position._buffer._data;
    //所选网格的所有uv
    var uv = vb.uv._buffer._data;
    //所选网格的所有法向量
    var normal = vb.normal._buffer._data;
    var p1 = {
        index: indices[0], position: [position[indices[0] * 3], position[indices[0] * 3 + 1], position[indices[0] * 3 + 2]],
        normal: [normal[indices[0] * 3], normal[indices[0] * 3 + 1], normal[indices[0] * 3 + 2]], uv: [uv[indices[0] * 2], uv[indices[0] * 2 + 1]]
    };
    var p2 = {
        index: indices[1], position: [position[indices[1] * 3], position[indices[1] * 3 + 1], position[indices[1] * 3 + 2]],
        normal: [normal[indices[1] * 3], normal[indices[1] * 3 + 1], normal[indices[1] * 3 + 2]], uv: [uv[indices[1] * 2], uv[indices[1] * 2 + 1]]
    };
    var p3 = {
        index: indices[2], position: [position[indices[2] * 3], position[indices[2] * 3 + 1], position[indices[2] * 3 + 2]],
        normal: [normal[indices[2] * 3], normal[indices[2] * 3 + 1], normal[indices[2] * 3 + 2]], uv: [uv[indices[2] * 2], uv[indices[2] * 2 + 1]]
    };

    mesh_outlook = createTryanglemMesh(p1, p2, p3, picked_mesh.id + "_" + face_id);
    mesh_outlook.material = mat_outlook;
    mesh_outlook.parent = picked_mesh; 
    //picked_mesh.material.wireframe = false;
    select_mesh = mesh_outlook;
    setCurrentMeshData(select_mesh);
    setSelectpickType(0);
}