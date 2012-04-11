


var control_panel_obj = $id("control_panel");
var control_image_obj = $id("control_image");
var control_panel_opened = false;

control_image_obj.addEventListener('mouseover', function(evt){
        mouse_over(control_image_obj);
    }, false);
	
control_image_obj.addEventListener('mouseout', function(evt){
        mouse_out(control_image_obj);
    }, false);
	
control_image_obj.addEventListener('mousedown', function(evt){
        mouse_click(control_image_obj);
    }, false);
	
	
function mouse_over(obj){
	if(control_panel_opened)
		obj.src = "arrow_up_over.png";
	else
		obj.src = "arrow_down_over.png";
}
function mouse_out(obj){

	if(control_panel_opened)
		obj.src = "arrow_up.png";
	else
		obj.src = "arrow_down.png";

}
function mouse_click(obj){
	
	if(control_panel_opened)
	{
		control_panel_obj.style.top = 10 - control_panel_obj.clientHeight;
	}
	else
	{
		control_panel_obj.style.top = 10;
	}
		
	control_panel_opened = !control_panel_opened;
	mouse_over(obj);
}

control_panel_obj.style.top = 10 - control_panel_obj.clientHeight;