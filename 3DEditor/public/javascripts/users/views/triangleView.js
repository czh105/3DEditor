function updateTriangleOption(vl){
	if(vl == 1){
		if($("#triangle_options_color").is(":hidden"))
		{
			$("#triangle_options_pictrue").css("display","none");
			$("#triangle_options_color").css("display","block");
		}
	}
	else if(vl == 2)
	{
		if($("#triangle_options_pictrue").is(":hidden"))
		{
			console.log("picture");
			$("#triangle_options_color").css("display","none");
			$("#triangle_options_pictrue").css("display","block");
		}
	}
}