function delMaterial(ev){
    var id = ev.id.substring(3);
    if(id==null || id == undefined){
        return;
    }
    var materials = scene.materials;
    for(var i = 0;i < materials.length;i++){
        if(materials[i].id == id){
            scene.removeMaterial(materials[i]);
            $("#delete_material_success").dialog({
                resizable: false,
                height:140,
                modal: true,
                title:"删除材质",
                type:"success",
                buttons:{
                    "确认":function(){
                        $(this).dialog("close");
                    }
                }
            });
            displayMaterialCollection();
            return;
        }
    }  
    $("#delete_material_fail").dialog({
        resizable: false,
        height:140,
        modal: true,
        title:"删除材质",
        type:"error",
        buttons:{
            "确认":function(){
                $(this).dialog("close");
            },
            "重新删除":function(){
                $(this).dialog('close');
                delMaterial(ev);
            }
        }
    });
}