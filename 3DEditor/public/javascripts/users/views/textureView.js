function initTexturePanel() {
    //≥ı ºªØ
}
function showAndCloseTexturePanel()
{
    if ($("#texture_panel").is(":hidden")) {
        $("#material_box").css("display", 'none');
		$("#texture_panel").css("display","block");
		document.getElementById("material_id").focus();
	}else{
		$("#texture_panel").css("display","none");
	}
}
var texture_panel = document.getElementById("texture_panel");
var texture_panel_clientX = 0;
var texture_panel_clientY = 0;
var texture_panel_distanceX = 0;
var texture_panel_distanceY = 0;
var texture_panel_isDown = false;
texture_panel.onmousedown = function(evt){
	var evt = evt || window.event;
	texture_panel_clientX = evt.clientX;
	texture_panel_clientY = evt.clientY;
	texture_panel_distanceX = texture_panel.offsetLeft;
	texture_panel_distanceY = texture_panel.offsetTop;
	texture_panel.style.cursor = 'move';
	texture_panel_isDown = true;
};
window.onmousemove = function(evt){
	if(texture_panel_isDown == false){
		return;
	}
	var evt = evt || window.event;
	var nclientX = evt.clientX;
	var nclientY = evt.clientY;
	var ndisX = nclientX - (texture_panel_clientX - texture_panel_distanceX);
	var ndisY = nclientY - (texture_panel_distanceY - texture_panel_distanceY);
	texture_panel.style.left = ndisX + "px";
	texture_panel.style.top = ndisY + "px";
};
texture_panel.onmouseup = function(evt){
	texture_panel_isDown = false;
	texture_panel.style.cursor ='default';
};