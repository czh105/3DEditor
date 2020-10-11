function showAndColseRightMenu(evt){
     //显示鼠标右键菜单
    if ($("#right_mouse_menu").is(":hidden")) {
        $("#right_mouse_menu").css("display", "block");
        $("#right_mouse_menu").css("border","1PX solid #000000");
        $("#right_mouse_menu").css("background-color","#e1d6d6");
        $("#right_mouse_menu").css("position","absolute");
        $("#right_mouse_menu").css("left",evt.clientX+'px');
        $("#right_mouse_menu").css("top",evt.clientY+'px');
        $("#right_mouse_menu").css("z-index",10);
        console.log("mouse menu show"+$("#right_mouse_menu").position().top);

    } else {
        $("#right_mouse_menu").css("display", "none");
    }
}
function setSubtractAndUnion(){
    $("#right_menu_union_mesh").removeAttr("display");
    $("#right_menu_subtract_mesh").removeAttr("display");
}
function initSubtractAndUnion(){
    $("#right_menu_union_mesh").css("pointer-events","none");
    $("#right_menu_subtract_mesh").css("pointer-events","none");
}
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
$(document).ready(function(){
    $("#right_mouse_menu").mousedown(function(evt){
        var evt = evt || window.event;
        if(evt.button == 2 && $("#right_mouse_menu").not(":hidden")){
            $("#right_mouse_menu").css("display", "none");
        }
    });
    initSubtractAndUnion();

    $("#go_back_history").click(function () {
        var rgb = $(this).css("color");
        var hexcode = RGBConvertHexadecimal(rgb);
        if (hexcode == "#C4C4C4") {
            return;
        }
        else if (hexcode == "#292929") {
            //goBackHistory();
        }
    });
    $("#cancel_history").click(function () {
        var rgb = $(this).css("color");
        var hexcode = RGBConvertHexadecimal(rgb);
        if (hexcode == "#C4C4C4") {
            return;
        }
        else if (hexcode== "#292929") {

        }
    });
    $("#mesh_lock").click(function () {
        var rgb = $(this).css("color");
        var hexcode = RGBConvertHexadecimal(rgb);
        if (hexcode == "#C4C4C4") {
            return;
        }
        else if (hexcode == "#292929") {
            lockMeshMenu();
        }
    });
    $("#zoom_in_camera_radius").click(function () {
        var rgb = $(this).css("color");
        var hexcode = RGBConvertHexadecimal(rgb);
        if (hexcode == "#C4C4C4") {
            return;
        }
        else if (hexcode == "#292929") {
            enlargeCameraRadiusMenu();
            
        }
    });
    $("#zoom_out_camera_radius").click(function () {
        var rgb = $(this).css("color");
        var hexcode = RGBConvertHexadecimal(rgb);
        if (hexcode == "#C4C4C4") {
            return;
        }
        else if (hexcode == "#292929") {
            narrowCameraRadiusMenu();
        }
    });
    $("#mesh_delete").click(function () {
        var rgb = $(this).css("color");
        var hexcode = RGBConvertHexadecimal(rgb);
        if (hexcode == "#C4C4C4") {
            return;
        }
        else if (hexcode == "#292929") {
            //网格移除函数
            deteletMeshMenu();
        }
    });
    $("#mesh_visibility").click(function () {

    });
});
function initLeftMenu() {
    if (select_mesh) {
        $("#mesh_lock").css("color", "#292929");
        $("#mesh_delete").css("color", "#292929");
        $("#mesh_visibility").css("color", "#292929");
    }
    else {
        $("#mesh_lock").css("color", "#C4C4C4");
        $("#mesh_delete").css("color", "#C4C4C4");
        $("#mesh_visibility").css("color", "#C4C4C4");
    }
    if (back_history.length > 0 ) {
        $("#go_back_history").css("color", "#292929");
        //console.log(back_history.length);
    }
    if (cancel_history.length > 0) {
        $("#cancel_history").css("color", "#292929");
    }
}
