//初始还坐标轴
document.onkeydown = (e)=>{
	if(e.key == 'w' || e.key == 'e' || e.key == 'r' || e.key == 'q'){ 
		gizmo_manager.positionGizmoEnabled = false;
        gizmo_manager.rotationGizmoEnabled = false;
        gizmo_manager.scaleGizmoEnabled = false;
        gizmo_manager.boundingBoxGizmoEnabled = false;
		if(e.key == 'w'){
	        gizmo_manager.positionGizmoEnabled = !gizmo_manager.positionGizmoEnabled;
	    }
	    if(e.key == 'e'){
	        gizmo_manager.rotationGizmoEnabled = !gizmo_manager.rotationGizmoEnabled;
	    }
	    if(e.key == 'r'){
	        gizmo_manager.scaleGizmoEnabled = !gizmo_manager.scaleGizmoEnabled;
	    }
	    if(e.key == 'q'){
	        gizmo_manager.boundingBoxGizmoEnabled = !gizmo_manager.boundingBoxGizmoEnabled;
	    }
    }
    if(e.key == 'y'){
    	gizmo_manager.attachToMesh(null);
    }
    /*if(e.key == 'u'){
        //切换本地/全局gizmo旋转定位
        gizmo_manager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = !gizmo_manager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh;
        gizmo_manager.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh = !gizmo_manager.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh;
    }*/
    // if(e.key == 's'){
    //     // 触发捕捉距离
    //     if(gizmo_manager.gizmos.scaleGizmo.snapDistance == 0){
    //         gizmo_manager.gizmos.scaleGizmo.snapDistance = 0.3;
    //         gizmo_manager.gizmos.rotationGizmo.snapDistance = 0.3;
    //         gizmo_manager.gizmos.positionGizmo.snapDistance = 0.3;
    //     }else{
    //         gizmo_manager.gizmos.scaleGizmo.snapDistance = 0;
    //         gizmo_manager.gizmos.rotationGizmo.snapDistance = 0;
    //         gizmo_manager.gizmos.positionGizmo.snapDistance = 0;
    //     }
    // }
    // if(e.key == 'd'){
    //     //切换Gizmos控件大小
    //     if(gizmo_manager.gizmos.scaleGizmo.scaleRatio == 1){
    //         gizmo_manager.gizmos.scaleGizmo.scaleRatio = 1.5;
    //         gizmo_manager.gizmos.rotationGizmo.scaleRatio = 1.5;
    //         gizmo_manager.gizmos.positionGizmo.scaleRatio = 1.5;
    //     }else{
    //         gizmo_manager.gizmos.scaleGizmo.scaleRatio = 1;
    //         gizmo_manager.gizmos.rotationGizmo.scaleRatio = 1;
    //         gizmo_manager.gizmos.positionGizmo.scaleRatio = 1;
    //     }
    // }
    if (e.key == 'Delete'){
        //删除网格
        if(select_mesh){ 
            var obj = ["deleteMesh",select_mesh];
            pushBackHistory(obj);
            deleteMesh(select_mesh);
        }
    }
};