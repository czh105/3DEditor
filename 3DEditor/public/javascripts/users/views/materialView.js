/*****************************主要实现material panel的展示 colorpicker*************************************/
//使得颜色面板展现
function searchTextureByUrl(url) {
    if (!url || url == 'null') {
        return null;
    }
    console.log(url);
    var textures = scene.textures;
    for (var i = 0; i < textures.length; i++) {
        if (url == textures[i].url) {
            return textures[i];
        }
    }
    return null;
}
function stringToFloat(str) {
    if (!str)
        return 1;
    return parseFolat(str);
}
function stringToBoolean(str) {
    if (str == 'true') {
        return true;
    } else {
        return false;
    }
}
//创建一个material
function createMaterial() {
    let material_id = $("#material_id").val();
    if (material_id != null) {
        let material_data = getMaterialPanelData();
        //根据material创建
        let material = new BABYLON.StandardMaterial(material_data.id, scene);
        if (material_data.ambient) {
            material.ambientColor = material_data.ambient;
        }
        if (material_data.diffuse) {
            material.diffuseColor = material_data.diffuse;
        }
        if (material_data.specular) {
            material.specularColor = material_data.specular;
        }
        if (material_data.emissive) {
            material.emissiveColor = material_data.emissive;
        }
        if (material_data.alpha) {
            material.alpha = stringToFloat(material_data.alpha);
        }
        if (material_data.specularPower) {
            material.specularPower = stringToFloat(material_data.specularPower);
        }
        if (material_data.wireframe) {
            material.wireframe = stringToBoolean(material_data.wireframe);
        }
        if (material_data.backFaceCulling) {
            material.backFaceCulling = stringToBoolean(material_data.backFaceCulling);
        }
        if (material_data.indexOfRefraction) {
            material.indexOfRefraction = stringToFloat(material_data.indexOfRefraction);
        }
        if (material_data.diffuseTexture) {
            material.diffuseTexture = searchTextureByUrl(material_data.diffuseTexture); 
        }
        if (material_data.ambientTexture) {
            material.ambientTexture = searchTextureByUrl(material_data.ambientTexture);
        }
        if (material_data.opacityTexture) {
            material.opacityTexture = searchTextureByUrl(material_data.opacityTexture);
        }
        if (material_data.refractionTexture) {
            material.refractionTexture = searchTextureByUrl(material_data.refractionTexture);
        }
        if (material_data.emissiveTexture) {
            material.emissiveTexture = searchTextureByUrl(material_data.emissiveTexture);
        }
        if (material_data.specularTexture) {
            material.specularTexture = searchTextureByUrl(material_data.specularTexture);
        }
        if (material_data.bumpTexture) {
            material.bumpTexture = searchTextureByUrl(material_data.bumpTexture);
        }
        if (material_data.lightmapTexture) {
            material.lightmapTexture = searchTextureByUrl(material_data.lightmapTexture);
        }
        closeMaterialPanel();
        $("#create_texture_success").dialog({
            resizable: false,
            height:140,
            modal: true,
            title:"创建材质",
            type:"success",
            buttons:{
                "确认":function(){
                    $(this).dialog("close");
                }
            }
        });
        createMeshMaterialOptions();
    }
	
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
//得到material面板的数据
function getMaterialPanelData(material){
	var material = {};
    material.id = $("#material_id").val();
	//material.name = $("#material_name").val();
	//material.disableDepthWrite = $("#material_depthwrite").val();
	let rgb = document.getElementById('emissive_color_label').value;
    let hexcode = RGBConvertHexadecimal(rgb);
    material.ambient = new BABYLON.Color3.FromHexString(hexcode);
	rgb = document.getElementById("diffuse_color_label").value;
    hexcode = RGBConvertHexadecimal(rgb);
    material.diffuse = new BABYLON.Color3.FromHexString(hexcode);
	rgb = document.getElementById("specular_color_label").value;
    hexcode = RGBConvertHexadecimal(rgb);
    material.specular = new BABYLON.Color3.FromHexString(hexcode);
	rgb = document.getElementById("emissive_color_label").value;
    hexcode = RGBConvertHexadecimal(rgb);
    material.emissive = new BABYLON.Color3.FromHexString(hexcode);
	material.specularPower = $("#material_specular_power").val();
    material.alpha = $("#material_alpha").val();
   
    material.wireframe = $("#material_wireframe").val();
    console.log(typeof material.wireframe);
	material.backFaceCulling = $("#material_backfaceCulling").val();
	material.indexOfRefraction = $("#material_index_of_refraction").val();
	material.useLightmapAsShadowmap = $("#material_shadowmap").val();
    material.diffuseTexture = $("#material_diffuse").val();
	material.ambientTexture = $("#material_ambient").val();
	material.opacityTexture = $("#material_opacity").val();
	material.refractionTexture = $("#material_refraction").val();
	material.emissiveTexture = $("#material_emissive").val();
	material.specularTexture = $("#material_specular").val();
	material.bumpTexture = $("#material_bump").val();
	material.lightmapTexture = $("#material_lightmap").val();
	return material;
}
//关闭material面板
function closeMaterialPanel(){
    if ($("#material_box").is(":hidden")) {
        $("#texture_panel").css("display", 'none');
        $("#material_box").css("display", "block");
        
		document.getElementById("material_id").focus();
	}else{
		$("#material_box").css("display","none");
	}
}
//添加material的texture列表
function materialTextureDatalist(el) {
    let children = el.childNodes;
    //console.log(children.length);
    el = removeAllChild(el);
    var option = document.createElement("option");
    option.value = "null";
    option.text = "null";
    el.appendChild(option);
    var textures = scene.textures;
    //console.log(textures.length);
	for(var i=0;i<textures.length;i++){
		option = document.createElement("option");
		option.value = textures[i].url;
		option.text = textures[i].url;
		el.appendChild(option);
	}
}
//创建默认的纹理选择option
/*function createMaterialTextureOptions()
{
    var diffuse_texture = document.getElementById("material_diffuse");
    var ambient_texture = document.getElementById("material_ambient");
    var opacity_texture = document.getElementById("material_opacity");
    var refraction_txture = document.getElementById("material_refraction");
    var emissive_texture = document.getElementById("material_emissive");
    var specular_texture = document.getElementById("material_specular");
    var bump_texture = document.getElementById("material_bump");
    var lightmap_texture = document.getElementById("material_lightmap");
    var texture_list = [];
    texture_list.push(diffuse_texture);
    texture_list.push(ambient_texture);
    texture_list.push(opacity_texture);
    texture_list.push(refraction_txture);
    texture_list.push(emissive_texture);
    texture_list.push(specular_texture);
    texture_list.push(bump_texture);
    texture_list.push(lightmap_texture);
    for(var i = 0; i <texture_list.length;i++){
        _materialTextureDatalist(texture_list[i]);
    }
    return;
    
}*/
//初始化material panel
//判读输入格式是否正确
function IsEmpty(el){
	var value = el.value;
	var regex = new RegExp("^([\uE7C7-\uE7F3]|[a-zA-Z0-9]){1,20}$");
	var res = regex.test(value);
	if(res == true){
		console.log("输入正确");
		var names = scene.materials;
		for(var i = 0;i<names.length;i++){
			if(names[i].name == value){
				$(this).attr("background-color","red");
				//alter("该Id已经存在");
			}
		}
	}
	else{
		$(this).attr("background-color","red");
		//alter("输入错误");
	}
}
$(function(){
	/**************1、一系列颜色面板****************************/
	$('#ambient_color_label').colorpicker();
      // Example using an event, to change the color of the .jumbotron background:
    $('#ambient_color_label').on('colorpickerChange', function(event) {
       $(this).css('background-color', event.color.toString());
        	//$("#material_show").color
      });
    $('#diffuse_color_label').colorpicker();
      // Example using an event, to change the color of the .jumbotron background:
    $('#diffuse_color_label').on('colorpickerChange', function(event) {
    $(this).css('background-color', event.color.toString());
     });
    $('#specular_color_label').colorpicker();
      // Example using an event, to change the color of the .jumbotron background:
    $('#specular_color_label').on('colorpickerChange', function(event) {
    $(this).css('background-color', event.color.toString());
        	//$("#material_show").color
    });
    $('#emissive_color_label').colorpicker();
      // Example using an event, to change the color of the .jumbotron background:
    $('#emissive_color_label').on('colorpickerChange', function(event) {
    $(this).css('background-color', event.color.toString());
      
    });
	/****************颜色面板结束*****************************/
});
var materialbox = document.getElementById("material_box");
var materialbox_clientX = 0;
var materialbox_clientY = 0;
var materialbox_distanceX = 0;
var materialbox_distanceY = 0;
var isDown = false;
materialbox.onmousedown = function(evt){
	var evt = evt || window.event;
	materialbox_clientX = evt.clientX;
	materialbox_clientY = evt.clientY;
	materialbox_distanceX = materialbox.offsetLeft;
	materialbox_distanceY = materialbox.offsetTop;
	materialbox.style.cursor = 'move';
	isDown = true;
};
materialbox.onmousemove = function(evt){
	if(isDown == false){
		return;
	}
	var evt = evt || window.event;
	var nclientX = evt.clientX;
	var nclientY = evt.clientY;
	var ndisX = nclientX - (materialbox_clientX - materialbox_distanceX);
	var ndisY = nclientY - (materialbox_distanceY - materialbox_distanceY);
	materialbox.style.left = ndisX + "px";
	materialbox.style.top = ndisY + "px";
};
materialbox.onmouseup = function(evt){
	isDown = false;
	materialbox.style.cursor ='default';
};
/******************************************end************************************************************/