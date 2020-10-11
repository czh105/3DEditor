$(document).ready(function(){
	var _this1 = null;
	$(".first-row").click(function(evt){
		if($(this).next().is(":hidden")){
			$(this).next().slideDown('slow');
			_this1 = $(this).next();
			var _this2 = null;
			_this1.find(".second-row1").click(function(evt){
				_this2 = $(this);
				if(_this2.next().is(":hidden")){
					_this2.next().slideDown('slow');
				}else{
					_this2.next().slideUp('slow');
					
				}
			});
		}
		else{
			_this1 = $(this).next();
			_this1.find(".second-row2").hide();
			$(this).next().slideUp("slow");
		}
    });
    //mesh的色彩实现
    $('#mesh_material_ambient_color').colorpicker();
    $('#mesh_material_ambient_color').on('colorpickerChange', function (event) {
        $(this).css('background-color', event.color.toString());
        changeMeshMaterialAmbientColor(event.color.toString());
    });

    $('#mesh_material_diffuse_color').colorpicker();
    $('#mesh_material_diffuse_color').on('colorpickerChange', function (event) {
        $(this).css('background-color', event.color.toString());
        //console.log(event.color.toString());
        changeMeshMaterialDiffuseColor(event.color.toString());
    });

    $('#mesh_material_specular_color').colorpicker();
    $('#mesh_material_specular_color').on('colorpickerChange', function (event) {
        $(this).css('background-color', event.color.toString());
        changeMeshMaterialSpecularColor(event.color.toString());
    });

    $('#mesh_material_emissive_color').colorpicker();
    $('#mesh_material_emissive_color').on('colorpickerChange', function (event) {
        $(this).css('background-color', event.color.toString());
        changeMeshMaterialDiffuseColor(event.color.toString());
    });

});
function disabledCurrentMeshPanel() {
    $("#mesh_id").attr("disabled", "disabled");
    $("#mesh_id").val("");
    $("#mesh_material").attr("disabled", "disabled");
    $("#mesh_material").val("");
    //$("#mesh_isEnabled").attr("disabled", "disabled");
    //$("#mesh_visible").attr("disabled", "disabled");
    //$("#mesh_parent").attr("disabled", "disabled");
    //$("#mesh_pickable").attr("disabled", "disabled");
    $("#mesh_position_x").attr("disabled", "disabled");
    $("#mesh_position_y").attr("disabled", "disabled");
    $("#mesh_position_z").attr("disabled", "disabled");
    $("#mesh_rotation_x").attr("disabled", "disabled");
    $("#mesh_rotation_y").attr("disabled", "disabled");
    $("#mesh_rotation_z").attr("disabled", "disabled");
    $("#mesh_scaling_x").attr("disabled", "disabled");
    $("#mesh_scaling_y").attr("disabled", "disabled");
    $("#mesh_scaling_z").attr("disabled", "disabled");
    disabledCurrentMaterialColorPanel();//禁用纹理颜色
}
function disabledCurrentMaterialColorPanel()
{
    $('#mesh_material_specular_color').attr("disabled", "disabled");
    $('#mesh_material_specular_color').css('background-color', 'rgb(255,255,255)');
    $('#mesh_material_specular_color').val('rbg(255,255,255)');
    $('#mesh_material_emissive_color').attr("disabled", "disabled");
    $('#mesh_material_emissive_color').css('background-color', 'rgb(255,255,255)');
    $('#mesh_material_emissive_color').val("rgb(255,255,255)");
    $('#mesh_material_ambient_color').attr("disabled", "disabled");
    $('#mesh_material_ambient_color').val("rgb(255,255,255)");
    $('#mesh_material_ambient_color').css('background-color', 'rgb(255,255,255)');
    $('#mesh_material_diffuse_color').attr("disabled", "disabled");    
    $('#mesh_material_diffuse_color').css('background-color', 'rgb(255,255,255)');
    $('#mesh_material_diffuse_color').val("rgb(255,255,255)");
}
function removeDisabledMaterialColorPanel(){
    $('#mesh_material_specular_color').removeAttr("disabled");
    $('#mesh_material_emissive_color').removeAttr("disabled");
    $('#mesh_material_ambient_color').removeAttr("disabled");
    $('#mesh_material_diffuse_color').removeAttr("disabled");
}
function removeDisabledCurrentMeshPanel() {
    //$("#mesh_id").removeAttr("disabled");
    $("#mesh_material").removeAttr("disabled");
    //$("#mesh_isEnabled").removeAttr("disabled");
    //$("#mesh_visible").removeAttr("disabled");
    //$("#mesh_parent").removeAttr("disabled");
    //$("#mesh_pickable").removeAttr("disabled");
    $("#mesh_position_x").removeAttr("disabled");
    $("#mesh_position_y").removeAttr("disabled");
    $("#mesh_position_z").removeAttr("disabled");
    $("#mesh_rotation_x").removeAttr("disabled");
    $("#mesh_rotation_y").removeAttr("disabled");
    $("#mesh_rotation_z").removeAttr("disabled");
    $("#mesh_scaling_x").removeAttr("disabled");
    $("#mesh_scaling_y").removeAttr("disabled");
    $("#mesh_scaling_z").removeAttr("disabled");
    if(select_mesh.material != null){
        removeDisabledMaterialColorPanel();
    }
   
}
function setCurrentMeshData(mesh){
	//console.log("展示当前mesh");
    if (mesh == null) {
        disabledCurrentMeshPanel();
        return;
    } else {
        removeDisabledCurrentMeshPanel();
    }
	$("#mesh_id").val(mesh.id);
	if(mesh.material !=null){
		//$("#mesh_material").val(mesh.material.id);
        //updateItemToSelected("mesh_material", mesh.material.id);
        setMeshMaterial(mesh.material.id);
	}
    /*updateItemToSelected('mesh_isEnabled', mesh.isEnabled());
    //console.log(mesh.id + "mesh_isEnabled:" + mesh.isEnabled());
    updateItemToSelected("mesh_visible", mesh.isVisible);
    //console.log(mesh.id + "isVisible:" + mesh.isVisible);
	if(mesh.parent!=null){
        updateItemToSelected("mesh_parent", mesh.parent.id);
	}
    updateItemToSelected("mesh_pickable", mesh.isPickable);*/
	var position = mesh.position;
	var rotation = mesh.rotation;
    var scaling = mesh.scaling;
	$("#mesh_position_x").val(parseFloat(position.x).toFixed(3));
	$("#mesh_position_y").val(parseFloat(position.y).toFixed(3));
	$("#mesh_position_z").val(parseFloat(position.z).toFixed(3));
	$("#mesh_rotation_x").val(parseFloat(rotation.x).toFixed(4));
	$("#mesh_rotation_y").val(parseFloat(rotation.y).toFixed(4));
	$("#mesh_rotation_z").val(parseFloat(rotation.z).toFixed(4));
	$("#mesh_scaling_x").val(parseFloat(scaling.x).toFixed(3));
	$("#mesh_scaling_y").val(parseFloat(scaling.y).toFixed(3));
	$("#mesh_scaling_z").val(parseFloat(scaling.z).toFixed(3));
}
function createTrueAndFalseOptions(select_id,item_value)
{
    var select = document.getElementById(selected_id);
    select.removeChild();
    select.removeChild();
    var item_values = ["false","true"];
    for (var i = item_values.length - 1; i >= 0; i--) {
        var option = document.createElement("option");
        option.value = item_values[i];
        option.text = item_values[i];
        select.appendChild(option);
    }
    if(item_value == true){
        item_value = "true";
    }
    else{
        item_value = "false";
    }
    select.value = item_value;
}
function setMeshMaterial(item_value){
    createMeshMaterialOptions();
    let obj_select = document.getElementById("mesh_material");
    obj_select.value = item_value;
}

//光标在mesh 的material创建
/*function createMeshMaterialOptions(el) {
    el = removeAllChild(el);
    document.getElementsByTagName('')
    var materials = scene.materials;
    if (materials.length > 0) {
        //开始创建
        var noption = document.createElement("option");
        noption.value = "none";
        noption.text = "none";
        el.appendChild(noption);
        for (var i = 0; i < materials.length; i++) {
            if (materials[i].id != el.value) {
                var option = document.createElement("option");
                option.value = materials[i].id;
                option.text = materials[i].id;
                el.appendChild(option);
            }
        }
    }
    else
        return;

}*/
//创建父类节点选项
/*function createMeshParentOptions(el) {
    if(select_mesh==null){
        return;
    }
    el = removeAllChild(el);
    var mesh = select_mesh;
    var meshes = scene.meshes;
    var noption = document.createElement("option");
    noption.value = "none";
    noption.text = "none";
    el.appendChild(noption);
    for (var i = 0; i < meshes.length; i++) {
        if (meshes[i].id != el.value && select_mesh.id) {
            var option = document.createElement("option");
            option.value = meshes[i].id;
            option.text = meshes[i].id;
            el.appendChild(option);
        }
    }
}*/
//创建material select options 只有当创建新的material或删除时才会创建新的
function createMeshMaterialOptions()
{
    var parent = document.getElementById("mesh_material");
    var childrens_node = document.getElementById("mesh_material").childNodes;
    for (var i = childrens_node.length - 1; i >= 0; i--) {
       parent.removeChild(childrens_node[i]);
    }

     //开始创建
    var noption = document.createElement("option");
    noption.value = "none";
    noption.text = "none";
    parent.appendChild(noption);

    var materials = scene.materials;
    if(materials.length > 0){
        //开始创建
        for (var i = 0; i < materials.length; i++) {
            if (materials[i].id != parent.value) {
                var child = document.createElement("option");
                child.value = materials[i].id;
                child.text = materials[i].id;
                parent.appendChild(child);
            }
        }
    }
    return;
}